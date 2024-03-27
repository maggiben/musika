/*
 * @file         : DownloadWorker.ts
 * @summary      : DownloadWorker class
 * @version      : 1.0.0
 * @project      : YtKit
 * @description  : downloads a video and optionally transcode
 * @author       : Benjamin Maggi
 * @email        : benjaminmaggi@gmail.com
 * @date         : 19 Dec 2021
 * @license:     : MIT
 *
 * Copyright 2021 Benjamin Maggi <benjaminmaggi@gmail.com>
 *
 *
 * License:
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { MessagePort } from 'node:worker_threads';
import { Readable, Writable } from 'node:stream';
import path from 'node:path';
import fs from 'node:fs';
import ytdl from 'ytdl-core';
import ytpl from '@distube/ytpl';
import ProgressStream from 'progress-stream';
import * as utils from '@shared/lib/utils';
import { AsyncCreatable } from '@shared/lib/AsyncCreatable';
import TimeoutStream from './TimeoutStream';
import EncoderStream, { EncoderStreamOptions, ITranscodingOptions } from './EncoderStream';

export interface IDownloadWorkerOptions {
  /**
   * Playlist item.
   */
  item: ytpl.result['items'][number];
  /**
   * Output file name
   */
  output?: string;
  /**
   * Output destination
   */
  savePath: string;
  /**
   * Timeout value prevents network operations from blocking indefinitely.
   */
  timeout?: number;
  /**
   * Download Options
   */
  downloadOptions?: ytdl.downloadOptions;
  /**
   * Media encoder options
   */
  encode: {
    enabled: boolean;
    replace: boolean;
    options: ITranscodingOptions;
  };
  /**
   * This is a MessagePort allowing communication with the parent thread.
   */
  parentPort: MessagePort;
}

export interface IDownloadWorkerMessage {
  type: string;
  source: ytpl.result['items'][number];
  error: Error;
  details: Record<string, unknown>;
}

export class DownloadWorker extends AsyncCreatable<IDownloadWorkerOptions> {
  private downloadStream!: Readable;
  private parentPort: MessagePort;
  private item: ytpl.result['items'][number];
  private output!: string;
  private savePath: string;
  private timeout: number;
  private downloadOptions: ytdl.downloadOptions;
  private encode?: IDownloadWorkerOptions['encode'];
  private encoderStream?: EncoderStream;
  private videoInfo!: ytdl.videoInfo;
  private videoFormat!: ytdl.videoFormat;
  private timeoutStream!: TimeoutStream;
  private outputStream!: fs.WriteStream;
  private cloneStream?: fs.WriteStream;
  private contentLength?: number;

  public constructor(options: IDownloadWorkerOptions) {
    super(options);
    this.item = options.item;
    this.parentPort = options.parentPort;
    this.timeout = options.timeout ?? 120 * 1000; // 120 seconds
    this.output = options.output ?? '{videoDetails.title}';
    this.savePath = options.savePath ?? '';
    this.encode = options.encode;
    this.downloadOptions = options.downloadOptions ?? {
      quality: 'highest',
      filter: 'videoandaudio',
    };
    // this.downloadOptions.filter = (format) => {
    //   // return format.container === 'mp4';
    //   console.log('FORMAT', format);
    //   console.log('found format ?', format.hasVideo && format.hasAudio);
    //   return format.hasVideo && format.hasAudio;
    // };
  }

  /**
   * Initializes an instance of the Downloader class.
   */
  public async init(): Promise<void> {
    try {
      this.handleMessages();
      await this.downloadVideo();
      // await this.downloadTest(150);
      return this.exit(0);
    } catch (error) {
      return this.error(error);
    }
  }

  /**
   * Handle messages from the parent process
   * @return {void}
   */
  private handleMessages(): void {
    this.parentPort.on('message', (base64Message: string) => {
      try {
        const message = JSON.parse(
          Buffer.from(base64Message, 'base64').toString(),
        ) as IDownloadWorkerMessage;
        switch (message.type) {
          case 'kill': {
            this.endStreams();
            this.exit(1);
            break;
          }
        }
      } catch (error) {
        return this.error(error);
      }
    });
  }

  /**
   * Worker download simulator
   */
  private async downloadTest(delay: number = 250): Promise<void> {
    return new Promise<void>((resolve) => {
      let percentage = 0;
      const interval = setInterval(() => {
        const increment = Math.floor(Math.random() * 10) + 1;
        percentage += increment;
        if (percentage >= 100) {
          this.parentPort.postMessage({
            type: 'end',
            source: this.item,
            details: {},
          });
          clearInterval(interval);
          resolve();
        } else if (percentage > 50 && ['8wswgaSrMJQ', 'nRfDgXdInoM'].includes(this.item.id)) {
          throw new Error('caca');
        } else {
          this.parentPort.postMessage({
            type: 'progress',
            source: this.item,
            details: {
              progress: {
                percentage,
              },
            },
          });
        }
      }, delay);
    });
  }

  /**
   * Downloads a video
   */
  private async downloadVideo(): Promise<
    { videoInfo: ytdl.videoInfo; videoFormat: ytdl.videoFormat } | undefined
  > {
    const videoInfo = await this.getVideoInfo();
    this.parentPort.postMessage({
      type: 'videoInfo',
      source: this.item,
      details: {
        videoInfo,
      },
    });
    return this.downloadFromInfo(videoInfo);
  }

  private async onEnd(): Promise<void> {
    return new Promise((resolve, reject) => {
      let downloadEnded = false;
      let outputStreamClosed = false;
      let cloneStreamClosed = false;
      const checkClose = async (): Promise<void> => {
        const shouldEnd =
          downloadEnded &&
          outputStreamClosed &&
          (cloneStreamClosed || !this.encode?.enabled || this.encode?.replace);

        // Send the end event
        if (shouldEnd) {
          this.parentPort.postMessage({
            type: 'end',
            source: this.item,
            details: {
              videoInfo: this.videoInfo,
              videoFormat: this.videoFormat,
            },
          });
          const ffmpegCommand = await this.encoderStream?.setCoverArt(this.item.thumbnail);
          ffmpegCommand?.once('end', () => {
            resolve();
          });
        }
      };

      // When download has ended
      this.downloadStream.once('end', async () => {
        downloadEnded = true;
        await checkClose();
      });
      // When the output stream has been closed
      this.outputStream.once('close', async () => {
        outputStreamClosed = true;
        await checkClose();
      });
      // When the clone stream has been closed
      this.cloneStream?.once('close', async () => {
        cloneStreamClosed = true;
        await checkClose();
      });

      /* Error Handling Block */
      this.encoderStream?.ffmpegCommand?.once('error', (error) => {
        /* If not making a copy then just error */
        if (this.encode?.replace) {
          return this.error(error, 'encoding-error');
        }
        /* If making a copy then just emit error */
        this.parentPort.postMessage({
          type: 'encoding-error',
          source: this.item,
          error,
        });
      });
      this.outputStream.once('error', reject);
      this.cloneStream?.once('error', reject);
      this.downloadStream.once('error', reject);
      this.timeoutStream.once('timeout', reject);
    });
  }

  private async downloadFromInfo(
    videoInfo: ytdl.videoInfo,
  ): Promise<{ videoInfo: ytdl.videoInfo; videoFormat: ytdl.videoFormat } | undefined> {
    // const defaultEncoders = await EncoderStream.getFormatDefaultCodecs(this.encoder?.options.format);
    this.downloadStream = ytdl.downloadFromInfo(videoInfo, this.downloadOptions);
    ({ videoInfo: this.videoInfo, videoFormat: this.videoFormat } =
      await this.setVideInfoAndVideoFormat());
    const videoSize = await this.getVideoSize();
    /* live streams are unsupported */
    if (videoSize) {
      this.postVideoSize(videoSize);
      this.postProgress();
    }
    this.onTimeout();
    await this.setVideoOutput();
    await this.onEnd();
    console.info('download complete!');
    return {
      videoInfo: this.videoInfo,
      videoFormat: this.videoFormat,
    };
  }

  /**
   * Pipes the download stream to either a file or ffmpeg
   * also sets the error handler function
   *
   * @returns {void}
   */
  private async setVideoOutput(): Promise<
    fs.WriteStream | NodeJS.WriteStream | Writable | undefined
  > {
    /* transcode stream */
    if (this.encode?.enabled) {
      /* Keep a copy of the original download */
      if (!this.encode.replace) {
        this.cloneStream = fs.createWriteStream(
          this.getOutputFile({
            format: `org.${this.videoFormat?.container}`,
          }),
        );
        this.downloadStream.pipe(this.cloneStream, { end: true });
      }
      const file = this.getOutputFile({
        format: this.encode.options.format,
      });
      this.outputStream = fs.createWriteStream(file);
      const encoderStreamOptions: EncoderStreamOptions = {
        encodeOptions: this.encode.options,
        metadata: {
          videoInfo: this.videoInfo,
          videoFormat: this.videoFormat,
        },
        inputStream: this.downloadStream,
        outputStream: this.outputStream,
      };
      this.encoderStream = new EncoderStream(encoderStreamOptions);

      return;
    }
    /* stream to file in native format */
    this.outputStream = fs.createWriteStream(this.getOutputFile());
    return this.downloadStream.pipe(this.outputStream, { end: true });
  }

  /**
   * Output human readable information about a video download
   * It handles live video too
   *
   * @returns {void}
   */
  private async getVideoSize(): Promise<number | undefined> {
    const sizeUnknown =
      (!('clen' in this.videoFormat) && this.videoFormat.isLive) ||
      this.videoFormat.isHLS ||
      this.videoFormat.isDashMPD;

    if (sizeUnknown) {
      return undefined;
    } else if (this.videoFormat.contentLength) {
      return parseInt(this.videoFormat.contentLength, 10);
    } else {
      return new Promise((resolve, reject) => {
        this.downloadStream.once('response', (response) => {
          if (this.downloadStream.destroyed) {
            return;
          }
          if (response.headers['content-length']) {
            const size = parseInt(response.headers['content-length'], 10);
            return resolve(size);
          } else {
            return resolve(undefined);
          }
        });
        this.downloadStream.once('error', reject);
      });
    }
  }

  /**
   * sends a contentLength message to the main thread
   *
   * @param {number} contentLength size of the video, in bytes.
   * @returns {void}
   */
  private postVideoSize(contentLength: number): void {
    this.contentLength = contentLength;
    this.parentPort.postMessage({
      type: 'contentLength',
      source: this.item,
      details: {
        contentLength,
      },
    });
  }

  /**
   * uses progress-stream to download progress to the main thread.
   *
   * @returns {void}
   */
  private postProgress(contentLength = this.contentLength): void {
    const progressStream = ProgressStream({
      length: contentLength,
      time: 100,
      drain: true,
    });
    this.downloadStream.pipe(progressStream, { end: true });
    progressStream.on('progress', (progress) => {
      this.parentPort.postMessage({
        type: 'progress',
        source: this.item,
        details: {
          progress,
        },
      });
    });
  }

  private onTimeout(): void {
    this.timeoutStream = new TimeoutStream({ timeout: this.timeout });
    this.downloadStream.pipe(this.timeoutStream, { end: true });
    this.timeoutStream.once('timeout', () => {
      this.downloadStream.unpipe(this.timeoutStream);
      this.error(
        new Error(`stream timeout for workerId: ${this.item.id} title: ${this.item.title}`),
        'timeout',
      );
    });
  }

  /**
   * Gets the ouput file fiven a file name or string template
   *
   * Templates are based on videoInfo properties for example:
   * --ouput {videoDetails.author.name} will generate a file who's name
   * will start with the video author's name
   * If no extension is given we'll use the video format container property
   *
   * @returns {string} output file
   */
  private getOutputFile(
    options: {
      output?: string;
      videoInfo?: ytdl.videoInfo;
      videoFormat?: ytdl.videoFormat;
      format?: string;
    } = {
      output: this.output,
      videoInfo: this.videoInfo,
      videoFormat: this.videoFormat,
      format: this.videoFormat?.container,
    },
  ): string {
    const {
      output = this.output,
      videoInfo = this.videoInfo,
      videoFormat = this.videoFormat,
      format,
    } = options;
    const filename = path.format({
      name: utils.tmpl(output, { ...videoInfo, ...videoFormat }),
      ext: `.${format}`,
    });
    return path.join(this.savePath, filename);
  }

  /**
   * Sets videoInfo & videoFormat variables when they become available
   * though the stream
   *
   * @returns {string} output file
   */
  private setVideInfoAndVideoFormat(): Promise<{
    videoInfo: ytdl.videoInfo;
    videoFormat: ytdl.videoFormat;
  }> {
    return new Promise((resolve, reject) => {
      this.downloadStream.once(
        'info',
        (videoInfo: ytdl.videoInfo, videoFormat: ytdl.videoFormat): void => {
          this.parentPort.postMessage({
            type: 'info',
            source: this.item,
            details: {
              videoInfo,
              videoFormat,
            },
          });
          return videoInfo && videoFormat
            ? resolve({ videoInfo, videoFormat })
            : reject(new Error('failed to get video info and format'));
        },
      );
      this.downloadStream.once('error', reject);
    });
  }

  private error(error: Error | unknown, type = 'error'): void {
    this.endStreams();
    this.parentPort.postMessage({
      type,
      source: this.item,
      error,
    });
    console.error(error);
    this.exit(1);
  }

  /**
   * Ends all streams and removed the output file
   *
   * @returns {void} output file
   */
  private endStreams(): void {
    if (this.downloadStream && this.outputStream) {
      this.downloadStream.unpipe(this.outputStream);
      /* clean clone if any */
      this.cloneStream &&
        this.downloadStream.unpipe(this.cloneStream) &&
        this.cloneStream.destroy();
      // destroy the download stream
      this.downloadStream.destroy();
      // destroy output stream
      this.outputStream.destroy();
      // Remove ouput file
      if (fs.existsSync(this.outputStream.path.toString())) {
        fs.unlinkSync(this.outputStream.path.toString());
      }
      // Remove ouput copy
      if (this.cloneStream && fs.existsSync(this.cloneStream.path.toString())) {
        fs.unlinkSync(this.cloneStream.path.toString());
      }
    }
  }

  private exit(code: number): never {
    console.info(`Exiting worker with code ${code}`);
    return process.exit(code);
  }

  /**
   * Gets info from a video additional formats and deciphered URLs.
   *
   * @returns {Promise<ytdl.videoInfo>} the video info object or undefined if it fails
   */
  private async getVideoInfo(): Promise<ytdl.videoInfo> {
    return ytdl.getInfo(this.item.url, {
      requestOptions: {
        timeout: this.timeout,
      },
    });
  }
}
