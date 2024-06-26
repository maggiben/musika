import fs from 'node:fs/promises';
import { M3uPlaylist, M3uMedia, M3uParser } from 'm3u-parser-generator';
import type { IPlaylist } from 'types/types';
import { timeStringToSeconds } from '@shared/lib/utils';
import checkPath from '@main/utils/checkPath';

export async function loadPlaylist(filePath: string): Promise<IPlaylist | undefined> {
  try {
    await fs.access(filePath, fs.constants.R_OK);
    const m3uString = await fs.readFile(filePath, 'utf8');

    const playlist = M3uParser.parse(m3uString);
    const items = playlist.medias.map((media, index) => ({
      url: media.attributes['url'] ?? media.location,
      filePath: checkPath(media.attributes['filePath'] ?? media.location)
        ? media.attributes['filePath'] ?? media.location
        : undefined,
      title: media.name ?? '',
      duration: media.duration ?? 0,
      id: media.attributes['tvg-id'] ?? media.name + ':' + index,
      thumbnail: media.attributes['tvg-logo'] ?? '',
      author: {
        name: media.artist ?? '',
        channelID: media.attributes['channel-id'] ?? '',
        url: media.attributes['channel-url'] ?? '',
      },
      favorite: media.attributes['favorite'] === 'true' ? true : false,
      dislike: media.attributes['dislike'] === 'true' ? true : false,
    }));
    return {
      id: playlist.attributes['tvg-id'] ?? '',
      title: playlist.title,
      thumbnail: {
        url: playlist.attributes['tvg-logo'] ?? '',
      },
      total_items: items.length,
      visibility: playlist.attributes['visibility'] as 'link only' | 'everyone',
      description: playlist.attributes['description'],
      url: playlist.attributes['url'] ?? '',
      lastUpdate: parseInt(playlist.attributes['last-update'] ?? '0', 10),
      author: {
        id: playlist.attributes['author-id'] ?? '',
        name: playlist.attributes['author-name'] ?? '',
        avatar: playlist.attributes['author-avatar'] ?? '',
        user: playlist.attributes['author-user'] ?? '',
        channel_url: playlist.attributes['author-channel_url'] ?? '',
        user_url: playlist.attributes['author-user_url'] ?? '',
      },
      items,
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function savePlaylist(playlist: IPlaylist, savePath: string): Promise<boolean> {
  try {
    const m3uPlaylist = new M3uPlaylist();
    m3uPlaylist.title = playlist.title;
    // m3uPlaylist.attributes[]
    m3uPlaylist.attributes['tvg-id'] = playlist.id;
    m3uPlaylist.attributes['tvg-logo'] = playlist.thumbnail?.url;
    m3uPlaylist.attributes['author-name'] = playlist.author?.name;
    m3uPlaylist.attributes['author-avatar'] = playlist.author?.avatar;
    m3uPlaylist.attributes['last-update'] = new Date().getTime().toString();
    playlist.items.forEach((item) => {
      const media = new M3uMedia(item.filePath ? item.filePath : item.url);
      media.attributes = {
        'tvg-id': item.id,
        'tvg-logo': item.thumbnail,
        url: item.url,
        filePath: item.filePath,
        favorite: item.favorite ? 'true' : 'false',
        dislike: item.dislike ? 'true' : 'false',
        'channel-id': item.author.channelID,
        'channel-url': item.author.url,
      };
      media.duration = item.duration ? timeStringToSeconds(item.duration.toString()) : 0;
      media.name = item.title;
      media.artist = item.author?.name;
      media.image = item.thumbnail;
      m3uPlaylist.medias.push(media);
    });
    await fs.writeFile(savePath, m3uPlaylist.getM3uString(), 'utf8');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
