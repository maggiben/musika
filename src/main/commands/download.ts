/*
 * @file         : playlist.ts
 * @summary      : playlist download command
 * @version      : 1.0.0
 * @project      : YtKit
 * @description  : downloads a all playlist videos given a playlist url
 * @author       : Benjamin Maggi
 * @email        : benjaminmaggi@gmail.com
 * @date         : 05 Jul 2021
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

import * as ytpl from '@distube/ytpl';
import * as ytdl from 'ytdl-core';
import { BrowserWindow } from 'electron';
import { Scheduler } from '../lib/Scheduler';
import type { IDownloadWorkerMessage } from '../lib/DownloadWorker';

interface IDownloadOptions {
  output: string;
  maxconnections?: number;
  retries?: number;
  flags: Record<string, unknown>;
}

enum Options {
  format = 'format',
  audioCodec = 'audioCodec',
  videoCodec = 'videoCodec',
  videoBitrate = 'videoBitrate',
  audioBitrate = 'audioBitrate',
}

export type EncodeOptions = { [key in keyof typeof Options]: string | number };

export default async function download(
  url: string,
  mainWindow: BrowserWindow | null,
  options?: IDownloadOptions,
): Promise<Record<string, unknown>> {
  const playlistId = ytpl.validateID(url) && (await ytpl.getPlaylistID(url));
  const videoId = ytdl.validateURL(url) && ytdl.getVideoID(url);
  if (playlistId) {
    const scheduler = new Scheduler({
      playlistId,
      playlistOptions: {
        gl: 'US',
        hl: 'en',
        limit: Infinity,
      },
      ...options,
    });
    scheduler
      .once('playlistItems', (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send('playlistItems', message);
      })
      .on('contentLength', (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send('contentLength', message);
      })
      .on('end', (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send('end', message);
      })
      .on('timeout', (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send('timeout', message);
      })
      .on('exit', (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send('exit', message);
      })
      .on('progress', (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send('progress', message);
      });
    scheduler.download();
  }
  return {
    playlistId,
    videoId,
  };
}
