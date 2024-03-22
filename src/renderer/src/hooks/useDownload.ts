import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type ytpl from '@distube/ytpl';
import type { Progress } from 'progress-stream';
import type { IDownloadWorkerMessage } from 'types/types';
import type { IpcRendererEvent } from 'electron';
import { useRecoilValue } from 'recoil';
import { preferencesState } from '@renderer/states/atoms';

export interface IProgress {
  [key: string]: number[];
}

const useDownload = (): IProgress => {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<IProgress>({});
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

      const notificationOptions = {
        body: options.body,
        icon: options.icon,
        image: options.image,
        silent,
        tag: 'musika',
      };

      const notification = new Notification(title, notificationOptions);

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

    const endListener = (_event: IpcRendererEvent, message: IDownloadWorkerMessage): void => {
      setProgress((prevState) => {
        const newState = { ...prevState };
        delete newState[message?.source?.id];
        return newState;
      });

      notify(t('download complete'), {
        body: `${message.source.title} complete !`,
        icon: message.source.thumbnail,
        image: message.source.thumbnail,
      });
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
      end: window.electron.ipcRenderer.on('end', endListener),
      timeout: window.electron.ipcRenderer.on('timeout', timeoutListener),
      exit: window.electron.ipcRenderer.on('exit', exitListener),
      progress: window.electron.ipcRenderer.on('progress', progressListener),
    };

    return () => {
      Object.values(listeners).forEach((listener) => listener());
    };
  }, []);

  return progress;
};

export default useDownload;
