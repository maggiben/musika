import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type ytpl from '@distube/ytpl';
import type { Progress } from 'progress-stream';
import type { IDownloadWorkerMessage } from 'types/types';
import type { IpcRendererEvent } from 'electron';
import { useRecoilValue } from 'recoil';
import { preferencesState } from '@renderer/states/atoms';

interface IProgress {
  [key: string]: number[];
}
interface IDownloadStatus {
  progress: IProgress;
  finished: boolean;
}

const useDownload = (): IDownloadStatus => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<IProgress>({});
  const [finished, setFinished] = useState(false);
  const preferences = useRecoilValue(preferencesState);

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

    const finishedListener = (): void => {
      notify(t('all downloads complete'), {
        body: `All items done downloading`,
      });
      setFinished(true);
    };

    const endListener = (_event: IpcRendererEvent, message: IDownloadWorkerMessage): void => {
      setProgress((prevState) => {
        const newState = { ...prevState };
        delete newState[message?.source?.id];
        return newState;
      });

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
      playlistItems: window.electron.ipcRenderer.on('playlistItems', playlistItemsListener),
      contentLength: window.electron.ipcRenderer.on('contentLength', contentLengthListener),
      finished: window.electron.ipcRenderer.on('finished', finishedListener),
      end: window.electron.ipcRenderer.on('end', endListener),
      timeout: window.electron.ipcRenderer.on('timeout', timeoutListener),
      exit: window.electron.ipcRenderer.on('exit', exitListener),
      progress: window.electron.ipcRenderer.on('progress', progressListener),
    };

    return () => {
      Object.values(listeners).forEach((listener) => listener());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { progress, finished };
};

export default useDownload;
