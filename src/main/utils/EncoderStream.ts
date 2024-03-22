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
  videoSize?: string;
  /**
   * Set audio bitrate
   */
  videoBitrate?: number;
  /**
   * Set audio bitrate
   */
  audioBitrate?: number;
  /**
   * Set audio frequency
   */
  audioFrequency?: number;
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
}

export default class EncoderStream extends AsyncCreatable<EncoderStreamOptions> {
  public stream!: Writable;
  public ffmpegCommand!: ffmpeg.FfmpegCommand;

  public constructor(private options: EncoderStreamOptions) {
    super(options);
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

  /* istanbul ignore next */
  public static command(input: Readable): ffmpeg.FfmpegCommand {
    return ffmpeg(input);
  }

  public static async validateEncoderOptions(encodeOptions: ITranscodingOptions): Promise<boolean> {
    const formats = await EncoderStream.getAvailableFormats();
    const codecs = await EncoderStream.getAvailableCodecs();
    const format = Object.entries(formats).find(([name]) => name === encodeOptions.format);
    const audioCodec =
      encodeOptions.audioCodec &&
      Object.entries(codecs).filter(([value]) => value === encodeOptions.audioCodec);
    const videoCodec =
      encodeOptions.videoCodec &&
      Object.entries(codecs).filter(([value]) => value === encodeOptions.videoCodec);
    const codec = [
      encodeOptions.audioCodec && audioCodec,
      encodeOptions.videoCodec && videoCodec,
    ].filter(Boolean);
    const canEncode = codec.every((value) =>
      Boolean(value && value.length && value[0][1].canEncode),
    );
    const canMux = format && format[1].canMux;
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
    console.log('in EncodeStream encodeOptions', encodeOptions);
    this.ffmpegCommand = Object.entries(encodeOptions).reduce((prev, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        prev[key](value);
      }
      return prev;
    }, EncoderStream.command(inputStream));
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
