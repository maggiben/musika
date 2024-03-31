import { useEffect, useState, DependencyList } from 'react';
import { useTranslation } from 'react-i18next';
import type ytpl from '@distube/ytpl';
import type { IpcRendererEvent } from 'electron';
import { useRecoilValue, useRecoilState } from 'recoil';
import type { Progress } from 'progress-stream';
import type { IDownloadWorkerMessage, ISchedulerMessage, ISchedulerResult } from 'types/types';
import { DownloadWorkerChannels, SchedulerChannels } from '@shared/rpc-channels';
import { preferencesState } from '@states/atoms';
import { itemsFilePathsSelector } from '@states/selectors';

interface IProgress {
  [key: string]: number[];
}
interface IDownloadStatus {
  progress: IProgress;
  finished: boolean;
}

const useDownload = (deps?: DependencyList): IDownloadStatus => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<IProgress>({});
  const [finished, setFinished] = useState(false);
  const preferences = useRecoilValue(preferencesState);
  const [itemsFilePaths, setItemsFilePaths] = useRecoilState(itemsFilePathsSelector);

  useEffect(() => {
    const notify = async (
      title: string,
      options: NotificationOptions,
    ): Promise<Notification | undefined> => {
      const { enabled, silent } = preferences.behaviour.notifications;
      if (!enabled || !('Notification' in window)) {
        return;
      }

      if (Notification?.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          return;
        }
      }

      const notificationOptions: NotificationOptions = {
        ...structuredClone(options) /* a copy of the object is needed */,
        silent,
        tag: 'musika',
      };

      const notification = new Notification(title, notificationOptions);

      /* if setting a listener causes notification to stay on */

      // notification.onclick = (event) => {
      //   notification.close();
      //   event.preventDefault();
      //   window.focus();
      // };

      return notification;
    };

    const playlistItemsListener = (
      _event: IpcRendererEvent,
      message: IDownloadWorkerMessage,
    ): void => {
      const { length } = message?.details?.playlistItems as ytpl.result['items'];
      console.log(`total items: ${length}`);
    };

    const contentLengthListener = (
      _event: IpcRendererEvent,
      message: IDownloadWorkerMessage,
    ): void => {
      const contentLength = message?.details?.contentLength as number;
      console.log(`contentLength: ${contentLength}`);
    };

    const finishedListener = (_event: IpcRendererEvent, message: ISchedulerMessage): void => {
      const results = message.details as ISchedulerResult[];
      const failed = results.filter(({ code }) => code !== 0);
      const body = failed.length
        ? t('all but items failed', { count: failed.length, total: failed.length })
        : t('all items done');
      notify(t('download complete'), {
        body,
      });
      setFinished(true);
    };

    const endListener = (_event: IpcRendererEvent, message: IDownloadWorkerMessage): void => {
      console.log('ended: ', message?.source);
      setProgress((prevState) => {
        const newState = { ...prevState };
        delete newState[message?.source?.id];
        return newState;
      });

      const mappedFilePaths = itemsFilePaths.map(([itemId, filePath]) => [
        itemId,
        message?.source?.id === itemId ? message?.source?.filePath : filePath,
      ]);

      setItemsFilePaths(mappedFilePaths);

      // notify(t('download complete'), {
      //   body: `${message.source.title} complete !`,
      //   icon: message.source.thumbnail,
      // });
    };

    const timeoutListener = (_event: IpcRendererEvent, message: IDownloadWorkerMessage): void => {
      setProgress((prevState) => {
        const newState = { ...prevState };
        delete newState[message?.source?.id];
        return newState;
      });
    };

    const exitListener = (_event: IpcRendererEvent, message: IDownloadWorkerMessage): void => {
      setProgress((prevState) => {
        const newState = { ...prevState };
        delete newState[message?.source?.id];
        return newState;
      });
    };

    const encodingErrorListener = (
      _event: IpcRendererEvent,
      message: IDownloadWorkerMessage,
    ): void => {
      console.error(message.error);
      setProgress((prevState) => {
        const newState = { ...prevState };
        delete newState[message?.source?.id];
        return newState;
      });
    };

    const progressListener = (_event: IpcRendererEvent, message: IDownloadWorkerMessage): void => {
      const { source } = message;
      const { percentage } = message?.details?.progress as Progress;
      setProgress((prevProgress) => {
        return {
          ...prevProgress,
          [source?.id]: [prevProgress?.[source?.id]?.[1] ?? 0, Math.floor(percentage)],
        };
      });
    };

    const listeners = {
      playlistItems: window.electron.ipcRenderer.on(
        SchedulerChannels.PLAYLISTI_ITEMS,
        playlistItemsListener,
      ),
      contentLength: window.electron.ipcRenderer.on(
        DownloadWorkerChannels.CONTENT_LENGTH,
        contentLengthListener,
      ),
      finished: window.electron.ipcRenderer.on(SchedulerChannels.FINISHED, finishedListener),
      end: window.electron.ipcRenderer.on(DownloadWorkerChannels.END, endListener),
      timeout: window.electron.ipcRenderer.on(DownloadWorkerChannels.TIMEOUT, timeoutListener),
      exit: window.electron.ipcRenderer.on(SchedulerChannels.WORKER_EXIT, exitListener),
      'encoding-error': window.electron.ipcRenderer.on(
        DownloadWorkerChannels.ENCODING_ERROR,
        encodingErrorListener,
      ),
      progress: window.electron.ipcRenderer.on(DownloadWorkerChannels.PROGRESS, progressListener),
    };

    return () => {
      Object.values(listeners).forEach((listener) => listener());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);

  return { progress, finished };
};

export default useDownload;
