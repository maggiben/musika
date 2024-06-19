import { useEffect } from 'react';

// import { usePlayerAPI } from '../../stores/usePlayerStore';
// import player from '../../lib/player';

const onAudioPlay = (): void => {
  navigator.mediaSession.playbackState = 'playing';
};

const onAudioPause = (): void => {
  navigator.mediaSession.playbackState = 'paused';
};

/**
 * Integration for MediaSession (mpris, macOS player controls etc)...
 */
const useMediaSessionEvents = (): void => {
  // const playerAPI = usePlayerAPI();

  useEffect(
    () => {
      // player.getAudio().addEventListener('loadstart', syncArtwork);
      // player.getAudio().addEventListener('play', onAudioPlay);
      // player.getAudio().addEventListener('pause', onAudioPause);

      // navigator.mediaSession.setActionHandler('play', () => playerAPI.play());
      // navigator.mediaSession.setActionHandler('pause', () => playerAPI.pause());
      // navigator.mediaSession.setActionHandler('previoustrack', () => playerAPI.previous());
      // navigator.mediaSession.setActionHandler('nexttrack', () => playerAPI.next());

      return function cleanup() {
        // player.getAudio().removeEventListener('loadstart', syncArtwork);
        // player.getAudio().removeEventListener('play', onAudioPlay);
        // player.getAudio().removeEventListener('pause', onAudioPause);
        // navigator.mediaSession.setActionHandler('play', null);
        // navigator.mediaSession.setActionHandler('pause', null);
        // navigator.mediaSession.setActionHandler('previoustrack', null);
        // navigator.mediaSession.setActionHandler('nexttrack', null);
      };
    },
    [
      /* playerAPI */
    ],
  );

  return;
};

export default useMediaSessionEvents;

/**
 * Helpers
 */

const syncArtwork = async (): Promise<void> => {
  // const track = player.getTrack();

  // if (track) {
  //   const cover = await window.MuseeksAPI.covers.getCoverAsBase64(track);

  //   navigator.mediaSession.metadata = new MediaMetadata({
  //     title: track.title,
  //     artist: track.artist.join(', '),
  //     album: track.album,
  //     artwork: cover ? [{ src: cover }] : undefined,
  //   });
  // }

  return;
};
