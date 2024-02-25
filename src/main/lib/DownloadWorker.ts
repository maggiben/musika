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

import { MessagePort } from 'worker_threads';
import { Readable, Writable } from 'stream';
import * as path from 'path';
import fs from 'fs';
import ytdl from 'ytdl-core';
import ytpl from '@distube/ytpl';
import ProgressStream from 'progress-stream';
import * as utils from '@shared/utils';
import getDownloadOptions from '@shared/getDownloadOptions';
import { AsyncCreatable } from '@shared/AsyncCreatable';
import TimeoutStream from './TimeoutStream';

export interface IDownloadWorkerOptions {
  /**
   * Playlist item.
   */
  item: ytpl.result['items'][0];
  /**
   * Output file name.
   */
  output?: string;
  /**
   * Timeout value prevents network operations from blocking indefinitely.
   */
  timeout?: number;
  /**
   * Flags
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flags?: any;
  /**
   * Media encoder options
   */
  // encoderOptions?: EncoderStream.EncodeOptions;
  /**
   * This is a MessagePort allowing communication with the parent thread.
   */
  parentPort: MessagePort;
}

export interface IDownloadWorkerMessage {
  type: string;
  source: ytpl.result['items'][0];
  error: Error;
  details: Record<string, unknown>;
}

export class DownloadWorker extends AsyncCreatable<IDownloadWorkerOptions> {
  private downloadStream!: Readable;
  private parentPort: MessagePort;
  private item: ytpl.result['items'][0];
  private output!: string;
  private timeout: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private flags?: any;
  private downloadOptions?: ytdl.downloadOptions;
  private videoInfo!: ytdl.videoInfo;
  private videoFormat!: ytdl.videoFormat;
  private timeoutStream!: TimeoutStream;
  private outputStream!: fs.WriteStream;
  private contentLength?: number;

  public constructor(options: IDownloadWorkerOptions) {
    super(options);
    this.item = options.item;
    this.parentPort = options.parentPort;
    this.timeout = options.timeout ?? 120 * 1000;
    this.output = options.output ?? '{videoDetails.title}';
    this.flags = options.flags;
    this.downloadOptions = this.flags && getDownloadOptions(this.flags);
  }

  /**
   * Initializes an instance of the Downloader class.
   */
  public async init(): Promise<void> {
    try {
      this.handleMessages();
      await this.downloadVideo();
      return this.exit(0);
    } catch (error) {
      return this.error(error);
    }
  }

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
      this.downloadStream.once('end', () => {
        this.parentPort.postMessage({
          type: 'end',
          source: this.item,
          details: {
            videoInfo: this.videoInfo,
            videoFormat: this.videoFormat,
          },
        });
        resolve();
      });
      this.outputStream.once('error', reject);
      this.downloadStream.once('error', reject);
      this.timeoutStream.once('timeout', reject);
    });
  }

  private async downloadFromInfo(
    videoInfo: ytdl.videoInfo,
  ): Promise<{ videoInfo: ytdl.videoInfo; videoFormat: ytdl.videoFormat } | undefined> {
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
    /* stream to file in native format */
    this.outputStream = fs.createWriteStream(this.getOutputFile());
    return this.downloadStream.pipe(this.outputStream);
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
          if (response['headers.content-length']) {
            const size = parseInt(response['headers.content-length'], 10);
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
    this.downloadStream.pipe(progressStream);
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
    this.downloadStream.pipe(this.timeoutStream);
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
      format: this.videoFormat.container,
    },
  ): string {
    const {
      output = this.output,
      videoInfo = this.videoInfo,
      videoFormat = this.videoFormat,
      format,
    } = options;
    // fs.appendFileSync('output.txt', `output: ${output}\nformat: ${options.format}`);
    return path.format({
      name: utils.tmpl(output, [videoInfo, videoFormat]),
      ext: `.${format}`,
    });
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
    this.exit(1);
  }

  /**
   * Ends all streams and removed the output file
   *
   * @returns {void} output file
   */
  private endStreams(): void {
    if (this.downloadStream && this.outputStream) {
      this.downloadStream.destroy();
      this.downloadStream.unpipe(this.outputStream);
      // end the file stream
      this.outputStream.end();
      // Remove ouput file
      if (fs.existsSync(this.outputStream.path.toString())) {
        this.outputStream.destroy();
        fs.unlinkSync(this.outputStream.path.toString());
      }
    }
  }

  private exit(code: number): never {
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
