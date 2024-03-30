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

import ytpl from '@distube/ytpl';
import ytdl from 'ytdl-core';
import { BrowserWindow, ipcMain } from 'electron';
import { Scheduler } from '../utils/Scheduler';
import { loadPreferences } from '../lib/preferences';
import { DownloadWorkerChannels } from '../lib/DownloadWorker';
import { SchedulerChannels } from '../utils/Scheduler';
import type { IDownloadWorkerMessage, IPlaylistItem } from 'types/types';

export default async function download(
  source: string | IPlaylistItem[],
  mainWindow?: BrowserWindow | null,
): Promise<Record<string, unknown>> {
  const playlistId =
    typeof source === 'string' && ytpl.validateID(source) && (await ytpl.getPlaylistID(source));
  const videoId = typeof source === 'string' && ytdl.validateURL(source) && ytdl.getVideoID(source);
  const playlistItems = Array.isArray(source) && source.length && source;
  if (playlistId || playlistItems) {
    const preferences = await loadPreferences(mainWindow);
    const scheduler = new Scheduler({
      ...(playlistId && { playlistId }),
      ...(playlistItems && { playlistItems }),
      playlistOptions: {
        gl: 'US',
        hl: 'en',
        limit: Infinity,
      },
      maxconnections: preferences.downloads.maxconnections,
      retries: preferences.downloads.retries,
      timeout: preferences.downloads.timeout,
      savePath: preferences.downloads.savePath,
      downloadOptions: {
        quality: preferences.downloads.quality,
        filter: preferences.downloads.filter as ytdl.Filter,
      },
      encode: {
        enabled: preferences.transcoding.enabled,
        replace: preferences.transcoding.replace,
        options: preferences.transcoding.options,
      },
    });
    scheduler
      .on(SchedulerChannels.WORKER_ONLINE, (message: IDownloadWorkerMessage) => {
        console.log('worker online:', message.source.id);
        mainWindow?.webContents.send(SchedulerChannels.WORKER_ONLINE, message);
      })
      .once(SchedulerChannels.PLAYLISTI_ITEMS, (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send(SchedulerChannels.PLAYLISTI_ITEMS, message);
      })
      .on(DownloadWorkerChannels.CONTENT_LENGTH, (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send(DownloadWorkerChannels.CONTENT_LENGTH, message);
      })
      .once(SchedulerChannels.FINISHED, (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send(SchedulerChannels.FINISHED, message);
      })
      .on(DownloadWorkerChannels.END, (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send(DownloadWorkerChannels.END, message);
      })
      .on(DownloadWorkerChannels.TIMEOUT, (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send(DownloadWorkerChannels.TIMEOUT, message);
      })
      .on(DownloadWorkerChannels.ENCODING_ERROR, (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send(DownloadWorkerChannels.ENCODING_ERROR, message);
      })
      .on(SchedulerChannels.WORKER_EXIT, (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send(SchedulerChannels.WORKER_EXIT, message);
      })
      .on(DownloadWorkerChannels.PROGRESS, (message: IDownloadWorkerMessage) => {
        mainWindow?.webContents.send(DownloadWorkerChannels.PROGRESS, message);
      });
    scheduler.download();
    ipcMain.once(SchedulerChannels.STOP, () => scheduler.stop());
  }
  return {
    source,
    playlistId,
    videoId,
  };
}
