/*
 * @file         : worker.ts
 * @summary      : video download worker
 * @version      : 1.0.0
 * @project      : YtKit
 * @description  : downloads a video in a new worker
 * @author       : Benjamin Maggi
 * @email        : benjaminmaggi@gmail.com
 * @date         : 06 Dec 2021
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

import { spawn } from 'node:child_process';
import { Readable, Writable } from 'node:stream';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { AsyncCreatable } from '@shared/lib/AsyncCreatable';
const ffmpegStatic = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegStatic);

export interface IEncoderStreamMetadata {
  /**
   * video info.
   */
  videoInfo: ytdl.videoInfo;
  /**
   * video format.
   */
  videoFormat: ytdl.videoFormat;
}

export interface ITranscodingOptions {
  /**
   * Set audio codec
   */
  audioCodec?: string;
  /**
   * Set video codec
   */
  videoCodec?: string;
  /**
   * Set video frame size
   */
  size?: string;
  /**
   * Set audio bitrate
   */
  videoBitrate?: string;
  /**
   * Set audio bitrate
   */
  audioBitrate?: string;
  /**
   * Set audio frequency
   */
  audioFrequency?: string;
  /**
   * Set output format
   */
  format: string;
}

/**
 * Constructor options for EncoderStream.
 */
export interface EncoderStreamOptions extends ffmpeg.FfmpegCommandOptions {
  /**
   * Input stream
   */
  inputStream: Readable;
  /**
   * Output stream
   */
  outputStream: Writable;
  /**
   * Media encoder options
   */
  encodeOptions: ITranscodingOptions;
  /**
   * Video metadata
   */
  metadata: IEncoderStreamMetadata;
  /**
   * Timeout value prevents encoding operation from blocking indefinitely.
   */
  timeout?: number;
}

export default class EncoderStream extends AsyncCreatable<EncoderStreamOptions> {
  public stream!: Writable;
  public ffmpegCommand!: ffmpeg.FfmpegCommand;
  private timeout: number;

  public constructor(private options: EncoderStreamOptions) {
    super(options);
    this.timeout = options.timeout ?? 30 * 1000; // 30 seconds
  }

  public static async getAvailableFormats(): Promise<ffmpeg.Formats> {
    return new Promise((resolve, reject) => {
      return ffmpeg.getAvailableFormats((error, formats) => {
        return error || !formats ? reject(error) : resolve(formats);
      });
    });
  }

  public static async getAvailableCodecs(): Promise<ffmpeg.Codecs> {
    return new Promise((resolve, reject) => {
      return ffmpeg.getAvailableCodecs((error, codecs) => {
        return error || !codecs ? reject(error) : resolve(codecs);
      });
    });
  }

  public static async getAvailableEncoders(): Promise<ffmpeg.Encoders> {
    return new Promise((resolve, reject) => {
      return ffmpeg.getAvailableEncoders((error, encoders) => {
        return error || !encoders ? reject(error) : resolve(encoders);
      });
    });
  }

  public static async getAvailableFilters(): Promise<ffmpeg.Filters> {
    return new Promise((resolve, reject) => {
      return ffmpeg.getAvailableFilters((error, filters) => {
        return error || !filters ? reject(error) : resolve(filters);
      });
    });
  }

  public static async getFormatDefaultCodecs(format?: string): Promise<
    | {
        videoCodec: ffmpeg.Codec;
        audioCodec: ffmpeg.Codec;
      }
    | undefined
  > {
    if (!format) return;
    const outputBuffers: unknown[] = [];
    const codecs = await this.getAvailableCodecs();
    const ffmpegProcess = spawn(ffmpegStatic, ['-h', `muxer=${format}`], {
      detached: false,
      windowsHide: true,
      stdio: 'pipe',
    });

    const defaultCodecsPromise = new Promise<{
      defaultVideoCodec: string;
      defaultAudioCodec: string;
    }>((resolve, reject) => {
      ffmpegProcess.stdout.on('data', (data: unknown): void => {
        outputBuffers.push(data);
      });

      ffmpegProcess.on('error', (error): void => {
        reject(error);
      });

      ffmpegProcess.on('exit', (code): void => {
        if (code !== 0) {
          const msg = `Failed with code = ${code}`;
          reject(new Error(msg));
        }
        const defaultVideoCodecMatch = outputBuffers
          .join('')
          .match(/Default video codec: ([a-zA-Z0-9_-]+)/i);
        const defaultAudioCodecMatch = outputBuffers
          .join('')
          .match(/Default audio codec: ([a-zA-Z0-9_-]+)/i);

        const defaultVideoCodec = defaultVideoCodecMatch ? defaultVideoCodecMatch[1] : '';
        const defaultAudioCodec = defaultAudioCodecMatch ? defaultAudioCodecMatch[1] : '';

        resolve({
          defaultVideoCodec,
          defaultAudioCodec,
        });
      });
    });

    const defaultCodecs = await defaultCodecsPromise;
    return {
      videoCodec: codecs[defaultCodecs.defaultVideoCodec],
      audioCodec: codecs[defaultCodecs.defaultAudioCodec],
    };
  }

  private command(input: Readable): ffmpeg.FfmpegCommand {
    return ffmpeg(input, {
      timeout: this.timeout,
      logger: {
        debug: (arg) => {
          console.log('[DEBUG] ' + arg);
        },
        info: (arg) => {
          console.log('[INFO] ' + arg);
        },
        warn: (arg) => {
          console.log('[WARN] ' + arg);
        },
        error: (arg) => {
          console.log('[ERROR] ' + arg);
        },
      },
    });
  }

  public static async validateEncoderOptions(encodeOptions: ITranscodingOptions): Promise<boolean> {
    const formats = await EncoderStream.getAvailableFormats();
    const codecs = await EncoderStream.getAvailableCodecs();
    const format = encodeOptions.format && formats[encodeOptions.format];
    const videoCodec = encodeOptions.videoCodec && codecs[encodeOptions.videoCodec];
    const audioCodec = encodeOptions.audioCodec && codecs[encodeOptions.audioCodec];
    const codec = [audioCodec, videoCodec].filter(Boolean);
    const canEncode =
      codec.length > 0
        ? codec.every((value) => {
            return Boolean(value && value.canEncode);
          })
        : true;
    const canMux = format && format.canMux;
    if (canMux && canEncode) {
      return true;
    }
    return false;
  }

  /**
   * Initializes an instance of the EncoderStream class.
   */
  public async init(): Promise<void> {
    if (await EncoderStream.validateEncoderOptions(this.options.encodeOptions)) {
      this.encodeStream();
    } else {
      throw new Error('Invalid encoding options');
    }
  }

  private encodeStream(): void {
    const { inputStream, outputStream, encodeOptions, metadata } = this.options;
    console.log('encodeOptions', encodeOptions);
    console.log('native container', metadata.videoFormat.container);
    this.ffmpegCommand = Object.entries(encodeOptions).reduce((prev, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        return prev[key](value);
      }
      return prev;
    }, this.command(inputStream));
    this.setMetadata(metadata, this.ffmpegCommand);
    this.stream = this.ffmpegCommand.pipe(outputStream, { end: true }); //end = true, close output stream after writing
  }

  private setMetadata(
    metadata: IEncoderStreamMetadata,
    encoder: ffmpeg.FfmpegCommand,
  ): ffmpeg.FfmpegCommand {
    const { videoId, title, author, shortDescription } =
      metadata.videoInfo.player_response.videoDetails;
    return encoder
      .outputOptions('-metadata', `title=${title}`)
      .outputOptions('-metadata', `author=${author}`)
      .outputOptions('-metadata', `artist=${author}`)
      .outputOptions('-metadata', `description=${shortDescription}`)
      .outputOptions('-metadata', `comment=${shortDescription}`)
      .outputOptions('-metadata', `episode_id=${videoId}`)
      .outputOptions('-metadata', 'network=YouTube');
  }
}
