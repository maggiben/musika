/*
 * @file         : Scheduler.ts
 * @summary      : Playlist thread scheduler
 * @version      : 1.0.0
 * @project      : YtKit
 * @description  : A hread scheduler
 * @author       : Benjamin Maggi
 * @email        : benjaminmaggi@gmail.com
 * @date         : 02 Dec 2021
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

import { EventEmitter } from 'stream';
import { Worker, WorkerOptions } from 'worker_threads';
import ytpl from '@distube/ytpl';
// import { EncoderStream } from './EncoderStream';
import type { IDownloadWorkerMessage } from '../lib/DownloadWorker';
import createWorker from '../workers/worker?nodeWorker';
import { IPlaylistItem } from 'types/types';
import type ytdl from 'ytdl-core';
import type { ITranscodingOptions } from '../lib/EncoderStream';

export interface ISchedulerOptions {
  /**
   * Youtube playlist id.
   */
  playlistId?: string;
  /**
   * Youtube playlist items.
   */
  playlistItems?: IPlaylistItem[];
  /**
   * Output destination
   */
  savePath: string;
  /**
   * Output file name
   */
  output?: string;
  /**
   * Property specifies the maximum number of simultaneous connections to a server.
   */
  maxconnections?: number;
  /**
   * Total number of connection attempts, including the initial connection attempt.
   */
  retries?: number;
  /**
   * Timeout value prevents network operations from blocking indefinitely.
   */
  timeout?: number;
  /**
   * Video download options.
   */
  playlistOptions?: ytpl.options;
  /**
   * Flags
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
}

export interface ISchedulerMessage {
  type: string;
  source: ytpl.result;
  error?: Error;
  details?: unknown;
}

export interface ISchedulerRetryItems {
  item: IPlaylistItem[][number];
  left: number;
}

export interface ISchedulerResult {
  item: IPlaylistItem[][number];
  code: number | boolean;
  error?: Error | string;
}

export interface ISchedulerWorkerOptions extends WorkerOptions {
  item: IPlaylistItem[][number];
  output: string;
  timeout: number;
  savePath: string;
  downloadOptions?: ytdl.downloadOptions;
  encode?: ISchedulerOptions['encode'];
}

export const SchedulerChannels = {
  STOP: 'STOP',
  RETRY: 'RETRY',
  FINISHED: 'FINISHED',
  PLAYLISTI_ITEMS: 'PLAYLISTI_ITEMS',
  WORKER_ERROR: 'WORKER_ERROR',
  WORKER_ONLINE: 'WORKER_ONLINE',
  WORKER_EXIT: 'WORKER_EXIT',
};

/*
  blender playlist: https://www.youtube.com/playlist?list=PL6B3937A5D230E335
  live items playlist: https://www.youtube.com/watch?v=5qap5aO4i9A&list=RDLV5qap5aO4i9A&start_radio=1&rv=5qap5aO4i9A&t=15666341
*/
export class Scheduler extends EventEmitter {
  private workers = new Map<string, Worker>();
  private retryItems = new Map<string, ISchedulerRetryItems>();
  private playlistId?: string;
  private playlistItems?: IPlaylistItem[];
  private output: string;
  private savePath: string;
  private maxconnections: number;
  private retries: number;
  private timeout: number;
  private playlistOptions?: ytpl.options;
  private downloadOptions?: ytdl.downloadOptions;
  private encode?: ISchedulerOptions['encode'];

  public constructor(options: ISchedulerOptions) {
    super();
    this.playlistId = options.playlistId;
    this.playlistItems = options.playlistItems;
    this.output = options.output ?? '{videoDetails.title}';
    this.savePath = options.savePath;
    this.maxconnections = options.maxconnections ?? 5;
    this.retries = options.retries ?? 5;
    this.timeout = options.timeout ?? 120 * 1000; // 120 seconds
    this.playlistOptions = options.playlistOptions;
    this.downloadOptions = options.downloadOptions;
    this.encode = options.encode;
  }

  /**
   * Initializes an instance of the Downloader class.
   */
  public async download(): Promise<Array<ISchedulerResult | undefined> | undefined> {
    if (this.playlistId) {
      const playlist = await ytpl(this.playlistId, this.playlistOptions);
      this.playlistItems = playlist.items as unknown as IPlaylistItem[];
      console.log('items: ', this.playlistItems?.length);
      this.emit(SchedulerChannels.PLAYLISTI_ITEMS, {
        source: playlist,
        details: { playlistItems: playlist.items },
      });
      return this.scheduler(this.playlistItems);
    } else if (this.playlistItems) {
      console.log('items: ', this.playlistItems?.length);
      this.emit(SchedulerChannels.PLAYLISTI_ITEMS, {
        source: this.playlistItems,
        details: { playlistItems: this.playlistItems },
      });
      return this.scheduler(this.playlistItems);
    }
    return undefined;
  }

  /**
   * Stops the task scheduler and any running taks.
   */
  public async stop(): Promise<void> {
    this.emit(SchedulerChannels.STOP);
  }

  /*
  public postWorkerMessage(worker: Worker, message: Scheduler.Message): void {
    return worker.postMessage(Buffer.from(JSON.stringify(message)).toString('base64'));
  }
  */

  private async scheduler(items: IPlaylistItem[]): Promise<Array<ISchedulerResult | undefined>> {
    const results: Array<ISchedulerResult | undefined> = [];
    for await (const result of this.runTasks<ISchedulerResult>(
      this.maxconnections,
      this.tasks(items),
    )) {
      results.push(result);
    }
    this.emit(SchedulerChannels.FINISHED, {
      type: SchedulerChannels.FINISHED,
      details: results,
    });
    return results;
  }

  /*
    from: https://stackoverflow.com/questions/40639432/what-is-the-best-way-to-limit-concurrency-when-using-es6s-promise-all
  */
  private tasks<T extends ISchedulerResult>(
    items: IPlaylistItem[],
  ): IterableIterator<() => Promise<T>> {
    const tasks = [] as Array<() => Promise<T>>;
    for (const item of items) {
      const task = async (): Promise<T> => {
        try {
          return await this.downloadWorkers<T>(item);
        } catch (error) {
          return {
            item,
            code: Number(!!error),
            error: (error as Error).message,
          } as T;
        }
      };
      tasks.push(task);
    }
    return tasks.values();
  }

  private async *raceAsyncIterators<T>(
    iterators: Array<AsyncIterator<T>>,
  ): AsyncGenerator<T | undefined, void, unknown> {
    async function queueNext(iteratorResult: {
      result?: IteratorResult<T>;
      iterator: AsyncIterator<T>;
    }): Promise<{
      result?: IteratorResult<T>;
      iterator: AsyncIterator<T>;
    }> {
      delete iteratorResult.result; // Release previous result ASAP
      iteratorResult.result = await iteratorResult.iterator.next();
      return iteratorResult;
    }
    const iteratorResults = new Map(
      iterators.map((iterator) => [iterator, queueNext({ iterator })]),
    );
    while (iteratorResults.size) {
      const winner: {
        result?: IteratorResult<T>;
        iterator: AsyncIterator<T>;
      } = await Promise.race(iteratorResults.values());
      if (winner.result && winner.result.done) {
        iteratorResults.delete(winner.iterator);
      } else {
        const value = winner.result && winner.result.value;
        iteratorResults.set(winner.iterator, queueNext(winner));
        yield value;
      }
    }
  }

  private async *runTasks<T>(
    maxConcurrency: number,
    iterator: IterableIterator<() => Promise<T>>,
  ): AsyncGenerator<T | undefined, void, unknown> {
    let stop = false;
    // Each worker is an async generator that polls for tasks
    // from the shared iterator.
    // Sharing the iterator ensures that each worker gets unique tasks.
    this.once(SchedulerChannels.STOP, () => (stop = true));
    const workers = new Array(maxConcurrency) as Array<AsyncIterator<T>>;
    for (let i = 0; i < maxConcurrency; i++) {
      workers[i] = (async function* (): AsyncIterator<T, void, unknown> {
        loop: for (const task of iterator) {
          if (stop) break loop;
          yield await task();
        }
      })();
    }
    yield* this.raceAsyncIterators<T>(workers);
  }

  /**
   * Retry download if failed
   *
   * @name retryDownloadWorker
   * @memberOf Scheduler:retryDownloadWorker
   * @category Control Flow
   * @param {IPlaylistItem[][number]} item the playlist item
   * @param {Worker} worker the worker currently executing
   * @returns {boolean} returns false if exceeded the maximum allowed retries otherwise returns true
   */
  private async retryDownloadWorker<T extends ISchedulerResult>(
    item: IPlaylistItem[][number],
  ): Promise<T> {
    if (!this.retryItems.has(item.id)) {
      this.retryItems.set(item.id, {
        item,
        left: this.retries,
      });
    }
    const retryItem = this.retryItems.get(item.id);
    if (retryItem && retryItem.left > 0) {
      try {
        this.emit(SchedulerChannels.RETRY, {
          source: item,
          details: {
            left: retryItem.left,
          },
        });
        retryItem.left -= 1;
        this.retryItems.set(item.id, retryItem);
        return await this.downloadWorkers<T>(item);
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
    throw new Error(`Could not retry id: ${item.id} retries left: ${retryItem && retryItem.left}`);
  }

  private async terminateDownloadWorker(item: IPlaylistItem[][number]): Promise<void> {
    const worker = this.workers.get(item.id);
    if (!worker) return;
    const code = await worker.terminate();
    this.workers.delete(item.id);
    this.emit(SchedulerChannels.WORKER_EXIT, {
      source: item,
      details: {
        code,
      },
    });
  }

  private async downloadWorkers<T extends ISchedulerResult>(
    item: IPlaylistItem[][number],
  ): Promise<T> {
    const workerData: ISchedulerWorkerOptions = {
      item,
      output: this.output,
      timeout: this.timeout,
      savePath: this.savePath,
      downloadOptions: this.downloadOptions,
      encode: this.encode,
    };
    /* just in case terminate any duplicate worker */
    if (this.workers.has(item.id)) {
      await this.terminateDownloadWorker(item);
    }
    return new Promise<T>((resolve, reject) => {
      const worker = createWorker({ workerData });
      this.workers.set(item.id, worker);
      return this.handleWorkerEvents<T>(worker, item, resolve, reject);
    });
  }

  private handleWorkerEvents<T extends ISchedulerResult>(
    worker: Worker,
    item: IPlaylistItem[][number],
    resolve: (value: T) => void,
    reject: (reason?: Error | number | unknown) => void,
  ): void {
    const onMessageHandler = (message: IDownloadWorkerMessage): void => {
      this.emit(message.type, message);
    };
    const onExit = (code: number): void => {
      this.emit(SchedulerChannels.WORKER_EXIT, { source: item, details: { code } });
      if (code !== 0) {
        this.retryDownloadWorker<T>(item)
          .then(resolve)
          .catch(() => reject(new Error(`Worker id: ${item.id} exited with code ${code}`)));
      } else {
        const result = {
          item,
          code,
        } as T;
        resolve(result);
      }
    };
    worker.on('message', onMessageHandler);
    worker.once('online', () => this.emit(SchedulerChannels.WORKER_ONLINE, { source: item }));
    worker.once('exit', onExit);
    worker.once('error', (error) => {
      /* Remove listeners */
      worker.off('message', onMessageHandler);
      worker.off('exit', onExit);
      this.emit(SchedulerChannels.WORKER_ERROR, { source: item, error });
      /* retry if error */
      this.retryDownloadWorker<T>(item)
        .then(resolve)
        .catch(() => reject(error));
    });
    /* terminate this worker */
    this.once(SchedulerChannels.STOP, async () => {
      worker.off('message', onMessageHandler);
      worker.off('exit', onExit);
      const code = await worker.terminate();
      this.emit(SchedulerChannels.WORKER_EXIT, { source: item, details: { code } });
      reject(new Error(`Worker id: ${item.id} exited with code ${code}`));
    });
  }
}
