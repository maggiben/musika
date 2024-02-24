/*
 * @file         : info.ts
 * @summary      : video info command
 * @version      : 1.0.0
 * @project      : Musika
 * @description  : displays information about a video
 * @author       : Benjamin Maggi
 * @email        : benjaminmaggi@gmail.com
 * @date         : 23 Feb 2024
 * @license:     : MIT
 *
 * Copyright 2024 Benjamin Maggi <benjaminmaggi@gmail.com>
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

import ytdl from 'ytdl-core';
import ytpl from '@distube/ytpl';

export default async function getVideoInfo(url: string): Promise<Record<string, unknown>> {
  // Promise<ytdl.videoInfo>
  const playlistOptions = {
    gl: 'US',
    hl: 'en',
    limit: Infinity,
  };
  try {
    const playlistId = ytpl.validateID(url) && (await ytpl.getPlaylistID(url));
    const videoId = ytdl.validateURL(url) && ytdl.getVideoID(url);
    const videoInfo = await ytdl.getInfo(url);
    const playlist = playlistId && (await ytpl(playlistId, playlistOptions));
    return {
      playlistId,
      videoId,
      videoInfo,
      playlist,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
