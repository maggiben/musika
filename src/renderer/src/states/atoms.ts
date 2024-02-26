import { atom } from 'recoil';
import type { IPreferences } from 'types/types';
import ytpl from '@distube/ytpl';
import { preferencesSelector } from './selectors';

export interface IPlaylist extends Omit<ytpl.result, 'views'> {
  thumbnail: {
    height: number;
    width: number;
    url: string;
  };
  views: string | number;
}

const mockPlaylist: IPlaylist = {
  id: 'PLF48AC0919899FFED',
  thumbnail: {
    url: 'https://i.ytimg.com/vi/q2ZHjSA8mkY/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDuA7yfheNh6mN5YqqcN5fyRe3oew',
    width: 336,
    height: 188,
  },
  url: 'https://www.youtube.com/playlist?list=PLF48AC0919899FFED',
  title: 'Yo Yo Ma Playlist',
  total_items: 30,
  views: 2700134,
  items: [
    {
      title: 'Yo-Yo Ma - Bach Cello Suite N°.1  - Prelude (HD)',
      id: 'q2ZHjSA8mkY',
      shortUrl: 'https://www.youtube.com/watch?v=q2ZHjSA8mkY',
      url: 'https://www.youtube.com/watch?v=q2ZHjSA8mkY&list=PLF48AC0919899FFED&index=1&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@Grandesmusicos',
        channelID: 'UCY9Fz9Jmm0oyF5UebjaZY1Q',
        name: 'Grandesmusicos',
      },
      thumbnail:
        'https://i.ytimg.com/vi/q2ZHjSA8mkY/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAlIV0mCxWU7g9uvqokElnP7km0iQ',
      isLive: false,
      duration: '2:46',
    },
    {
      title: 'Yo-Yo Ma - Bach Cello Suite N°.2  -  Sarabande (HD)',
      id: 'OHKn7VwTmEs',
      shortUrl: 'https://www.youtube.com/watch?v=OHKn7VwTmEs',
      url: 'https://www.youtube.com/watch?v=OHKn7VwTmEs&list=PLF48AC0919899FFED&index=2&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@Grandesmusicos',
        channelID: 'UCY9Fz9Jmm0oyF5UebjaZY1Q',
        name: 'Grandesmusicos',
      },
      thumbnail:
        'https://i.ytimg.com/vi/OHKn7VwTmEs/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAlMegdC_tkpN7bl0Oe6HbcwTP5YA',
      isLive: false,
      duration: '4:36',
    },
    {
      title: 'Yo-Yo Ma - Bach Cello Suite N°.6  -  Sarabande (HD)',
      id: 'a1QzMNM94-s',
      shortUrl: 'https://www.youtube.com/watch?v=a1QzMNM94-s',
      url: 'https://www.youtube.com/watch?v=a1QzMNM94-s&list=PLF48AC0919899FFED&index=3&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@Grandesmusicos',
        channelID: 'UCY9Fz9Jmm0oyF5UebjaZY1Q',
        name: 'Grandesmusicos',
      },
      thumbnail:
        'https://i.ytimg.com/vi/a1QzMNM94-s/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCcF0RewUMgOdmhZy-JxpmGJaD9bw',
      isLive: false,
      duration: '5:01',
    },
    {
      title: 'Yo-Yo Ma - Cello Suite No.6 Gigue (HD)',
      id: 'AoBi12e3wBo',
      shortUrl: 'https://www.youtube.com/watch?v=AoBi12e3wBo',
      url: 'https://www.youtube.com/watch?v=AoBi12e3wBo&list=PLF48AC0919899FFED&index=4&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@Grandesmusicos',
        channelID: 'UCY9Fz9Jmm0oyF5UebjaZY1Q',
        name: 'Grandesmusicos',
      },
      thumbnail:
        'https://i.ytimg.com/vi/AoBi12e3wBo/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC-_0dwichfK6kxut3Oy5At7fjnFQ',
      isLive: false,
      duration: '3:25',
    },
    {
      title: 'YO-YO MA -- Bach´s Bourree - Suite No. 3',
      id: 'SSMkLVAF0qY',
      shortUrl: 'https://www.youtube.com/watch?v=SSMkLVAF0qY',
      url: 'https://www.youtube.com/watch?v=SSMkLVAF0qY&list=PLF48AC0919899FFED&index=5&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@Grandesmusicos',
        channelID: 'UCY9Fz9Jmm0oyF5UebjaZY1Q',
        name: 'Grandesmusicos',
      },
      thumbnail:
        'https://i.ytimg.com/vi/SSMkLVAF0qY/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCNq2Z7SIcc_J0WAYgcU5Yq8XXBpg',
      isLive: false,
      duration: '2:26',
    },
    {
      title: 'Yo-Yo Ma: Elgar Cello Concerto, 1st mvmt',
      id: 'RM9DPfp7-Ck',
      shortUrl: 'https://www.youtube.com/watch?v=RM9DPfp7-Ck',
      url: 'https://www.youtube.com/watch?v=RM9DPfp7-Ck&list=PLF48AC0919899FFED&index=6&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@medpiano',
        channelID: 'UCAe7jeTPgJqnycTiHie5iQg',
        name: 'medpiano',
      },
      thumbnail:
        'https://i.ytimg.com/vi/RM9DPfp7-Ck/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCBs3ftZLEo2dZkCZyyqxSDg-1GyQ',
      isLive: false,
      duration: '9:47',
    },
    {
      title: 'Yo-Yo Ma: Elgar Cello Concerto, 2nd mvmt',
      id: 'WIvD0RgaGmU',
      shortUrl: 'https://www.youtube.com/watch?v=WIvD0RgaGmU',
      url: 'https://www.youtube.com/watch?v=WIvD0RgaGmU&list=PLF48AC0919899FFED&index=7&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@medpiano',
        channelID: 'UCAe7jeTPgJqnycTiHie5iQg',
        name: 'medpiano',
      },
      thumbnail:
        'https://i.ytimg.com/vi/WIvD0RgaGmU/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAl5aEMaE8rMgSjhTJ63OjnUxuLTw',
      isLive: false,
      duration: '3:01',
    },
    {
      title: 'Yo-Yo Ma: Elgar Cello Concerto, 2nd mvmt',
      id: 'WIvD0RgaGmU',
      shortUrl: 'https://www.youtube.com/watch?v=WIvD0RgaGmU',
      url: 'https://www.youtube.com/watch?v=WIvD0RgaGmU&list=PLF48AC0919899FFED&index=8&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@medpiano',
        channelID: 'UCAe7jeTPgJqnycTiHie5iQg',
        name: 'medpiano',
      },
      thumbnail:
        'https://i.ytimg.com/vi/WIvD0RgaGmU/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAl5aEMaE8rMgSjhTJ63OjnUxuLTw',
      isLive: false,
      duration: '3:01',
    },
    {
      title: 'Yo-Yo Ma: Elgar Cello Concerto, 3rd mvmt',
      id: 'pXuQceF2_Ds',
      shortUrl: 'https://www.youtube.com/watch?v=pXuQceF2_Ds',
      url: 'https://www.youtube.com/watch?v=pXuQceF2_Ds&list=PLF48AC0919899FFED&index=9&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@medpiano',
        channelID: 'UCAe7jeTPgJqnycTiHie5iQg',
        name: 'medpiano',
      },
      thumbnail:
        'https://i.ytimg.com/vi/pXuQceF2_Ds/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDHbiI7naumKS0WFer14fHp4klgVw',
      isLive: false,
      duration: '7:09',
    },
    {
      title: 'Yo-Yo Ma: Elgar Cello Concerto, 4th mvmt',
      id: 'hjYy71hqu84',
      shortUrl: 'https://www.youtube.com/watch?v=hjYy71hqu84',
      url: 'https://www.youtube.com/watch?v=hjYy71hqu84&list=PLF48AC0919899FFED&index=10&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@medpiano',
        channelID: 'UCAe7jeTPgJqnycTiHie5iQg',
        name: 'medpiano',
      },
      thumbnail:
        'https://i.ytimg.com/vi/hjYy71hqu84/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDPqbbQqXTus23UKjmEW_e53KBOlw',
      isLive: false,
      duration: '10:01',
    },
    {
      title: 'Yo-Yo Ma The Swan  Saint-Saens',
      id: 'zNbXuFBjncw',
      shortUrl: 'https://www.youtube.com/watch?v=zNbXuFBjncw',
      url: 'https://www.youtube.com/watch?v=zNbXuFBjncw&list=PLF48AC0919899FFED&index=11&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@Nodame2006',
        channelID: 'UC_mZKXsFoKSpcmSqerMwBsQ',
        name: 'Nodame2006',
      },
      thumbnail:
        'https://i.ytimg.com/vi/zNbXuFBjncw/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDMZc8BV9NrsqfBD3z_cDOcrdUMHA',
      isLive: false,
      duration: '3:44',
    },
    {
      title: 'Yo-Yo Ma: Tchaikovsky "Andante Cantabile" (live)',
      id: '_qH13hpBgDI',
      shortUrl: 'https://www.youtube.com/watch?v=_qH13hpBgDI',
      url: 'https://www.youtube.com/watch?v=_qH13hpBgDI&list=PLF48AC0919899FFED&index=12&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@azcello',
        channelID: 'UCjNqPasYfu-vTE9XKqOf35A',
        name: 'azcello',
      },
      thumbnail:
        'https://i.ytimg.com/vi/_qH13hpBgDI/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAnBezrWnuG40VgmY8xlZkVTGpOIw',
      isLive: false,
      duration: '8:43',
    },
    {
      title: 'Playing Love - Yo-Yo Ma plays Ennio Morricone',
      id: '1qcFzZrhkWY',
      shortUrl: 'https://www.youtube.com/watch?v=1qcFzZrhkWY',
      url: 'https://www.youtube.com/watch?v=1qcFzZrhkWY&list=PLF48AC0919899FFED&index=13&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@lonnegan4',
        channelID: 'UCGMgtLFA5rxh7TRzAakmhBg',
        name: 'lonnegan4',
      },
      thumbnail:
        'https://i.ytimg.com/vi/1qcFzZrhkWY/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gSAAuADigIMCAAQARhlIGIoVTAP&rs=AOn4CLATPxszPhs1jaAc6q9rnKb4h11V9w',
      isLive: false,
      duration: '1:50',
    },
    {
      title: 'Nostalgia. Yo-Yo Ma Plays Ennio Morricone',
      id: '7soF7lVzWgI',
      shortUrl: 'https://www.youtube.com/watch?v=7soF7lVzWgI',
      url: 'https://www.youtube.com/watch?v=7soF7lVzWgI&list=PLF48AC0919899FFED&index=14&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@PISTOLEROLOKOO',
        channelID: 'UCNfRaBdIMmfsaIZOqldImpQ',
        name: 'Munisalvas México',
      },
      thumbnail:
        'https://i.ytimg.com/vi/7soF7lVzWgI/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAuFeI-D7wv3ey58byfqjphJ_TNFg',
      isLive: false,
      duration: '2:19',
    },
    {
      title: 'SOUL OF THE TANGO-Le Grand Tango',
      id: 'jQ1Iet0vgjk',
      shortUrl: 'https://www.youtube.com/watch?v=jQ1Iet0vgjk',
      url: 'https://www.youtube.com/watch?v=jQ1Iet0vgjk&list=PLF48AC0919899FFED&index=15&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@syk2330',
        channelID: 'UCEhyJmyt4J2tOnthwatl2sA',
        name: 'syk2330',
      },
      thumbnail:
        'https://i.ytimg.com/vi/jQ1Iet0vgjk/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBXW6mHMePhUuRCHO4o79rP6O5euA',
      isLive: false,
      duration: '11:49',
    },
    {
      title: 'SOUL OF THE TANGO- Sur Regreso Al Amor.',
      id: 'kQ5qkV7hJZQ',
      shortUrl: 'https://www.youtube.com/watch?v=kQ5qkV7hJZQ',
      url: 'https://www.youtube.com/watch?v=kQ5qkV7hJZQ&list=PLF48AC0919899FFED&index=16&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@syk2330',
        channelID: 'UCEhyJmyt4J2tOnthwatl2sA',
        name: 'syk2330',
      },
      thumbnail:
        'https://i.ytimg.com/vi/kQ5qkV7hJZQ/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBm0dS9E1CxYJvp4E6KLlph4UUemA',
      isLive: false,
      duration: '6:12',
    },
    {
      title: 'Yo-Yo Ma: Elgar Cello Concerto, 1st mvmt',
      id: 'RM9DPfp7-Ck',
      shortUrl: 'https://www.youtube.com/watch?v=RM9DPfp7-Ck',
      url: 'https://www.youtube.com/watch?v=RM9DPfp7-Ck&list=PLF48AC0919899FFED&index=17&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@medpiano',
        channelID: 'UCAe7jeTPgJqnycTiHie5iQg',
        name: 'medpiano',
      },
      thumbnail:
        'https://i.ytimg.com/vi/RM9DPfp7-Ck/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCBs3ftZLEo2dZkCZyyqxSDg-1GyQ',
      isLive: false,
      duration: '9:47',
    },
    {
      title: 'YO-YO MA',
      id: 'XIKdv0mjg6k',
      shortUrl: 'https://www.youtube.com/watch?v=XIKdv0mjg6k',
      url: 'https://www.youtube.com/watch?v=XIKdv0mjg6k&list=PLF48AC0919899FFED&index=18&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@jammin104',
        channelID: 'UCLA5dKHV19ttD9u6LHBrxPQ',
        name: 'jammin104',
      },
      thumbnail:
        'https://i.ytimg.com/vi/XIKdv0mjg6k/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBYiGmowNZmDgCPql9m8nfX5UgEMA',
      isLive: false,
      duration: '7:06',
    },
    {
      title: 'Yo Yo Ma plays paganini caprice 24 on cello',
      id: 'lgAurilSDXQ',
      shortUrl: 'https://www.youtube.com/watch?v=lgAurilSDXQ',
      url: 'https://www.youtube.com/watch?v=lgAurilSDXQ&list=PLF48AC0919899FFED&index=19&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@nico22059',
        channelID: 'UCqlJUjbfOQWPgS9lQe8iwFg',
        name: 'nico22059',
      },
      thumbnail:
        'https://i.ytimg.com/vi/lgAurilSDXQ/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDUb0ADrZbgzP8QDtq4ZOlq6EarfQ',
      isLive: false,
      duration: '5:09',
    },
    {
      title: 'YO-YO MA  plays Bach',
      id: '9NaVpv9jsTo',
      shortUrl: 'https://www.youtube.com/watch?v=9NaVpv9jsTo',
      url: 'https://www.youtube.com/watch?v=9NaVpv9jsTo&list=PLF48AC0919899FFED&index=20&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@jammin104',
        channelID: 'UCLA5dKHV19ttD9u6LHBrxPQ',
        name: 'jammin104',
      },
      thumbnail:
        'https://i.ytimg.com/vi/9NaVpv9jsTo/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD-y39IhJTQDUFfixehAMUkKYKwJg',
      isLive: false,
      duration: '6:17',
    },
    {
      title: 'Yo-Yo Ma - Appalachian Waltz',
      id: 'tXSqZAEOn2c',
      shortUrl: 'https://www.youtube.com/watch?v=tXSqZAEOn2c',
      url: 'https://www.youtube.com/watch?v=tXSqZAEOn2c&list=PLF48AC0919899FFED&index=21&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@Celloics',
        channelID: 'UCiZK_ybJrAon7qP9nd_nEPg',
        name: 'Rich Rodriguez',
      },
      thumbnail:
        'https://i.ytimg.com/vi/tXSqZAEOn2c/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCu3N7CwDy1l4mw4H-e0UX8_6--pw',
      isLive: false,
      duration: '4:02',
    },
    {
      title: 'Yo-Yo Ma - Mumuki',
      id: 'aN7N12iChOg',
      shortUrl: 'https://www.youtube.com/watch?v=aN7N12iChOg',
      url: 'https://www.youtube.com/watch?v=aN7N12iChOg&list=PLF48AC0919899FFED&index=22&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@gothikan',
        channelID: 'UC5oB2_ythDThJWjdJoSXnCA',
        name: 'Lila',
      },
      thumbnail:
        'https://i.ytimg.com/vi/aN7N12iChOg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD_xN7JEfx5FQqV9zQ9ow146qk7wQ',
      isLive: false,
      duration: '5:09',
    },
    {
      title: 'Milonga del Angel Yo-Yo Ma',
      id: 'zSqIdKwQ0PU',
      shortUrl: 'https://www.youtube.com/watch?v=zSqIdKwQ0PU',
      url: 'https://www.youtube.com/watch?v=zSqIdKwQ0PU&list=PLF48AC0919899FFED&index=23&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@EdznaCrow',
        channelID: 'UCBGjIJ6QeC3mHY_DgcvUoNw',
        name: 'Claudia Silva',
      },
      thumbnail:
        'https://i.ytimg.com/vi/zSqIdKwQ0PU/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBk_zjbTOaW-EgiMTJjOIOGhJJBew',
      isLive: false,
      duration: '6:47',
    },
    {
      title: 'Waldir Azevedo - "Brasileirinho" - Yo-Yo Ma Obrigado Brazil',
      id: 'Hs7REKDNxKw',
      shortUrl: 'https://www.youtube.com/watch?v=Hs7REKDNxKw',
      url: 'https://www.youtube.com/watch?v=Hs7REKDNxKw&list=PLF48AC0919899FFED&index=24&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@tittattoe123',
        channelID: 'UC1HFdsgVuIV5LeE7ycb_szQ',
        name: 'tittattoe123',
      },
      thumbnail:
        'https://i.ytimg.com/vi/Hs7REKDNxKw/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCDqATdDwq2Wkpcbon1mah4d_E1tg',
      isLive: false,
      duration: '3:31',
    },
    {
      title: 'Yo-Yo Ma & Rosa Passos perform Chega de Saudade',
      id: 'RiVo4sbLV8o',
      shortUrl: 'https://www.youtube.com/watch?v=RiVo4sbLV8o',
      url: 'https://www.youtube.com/watch?v=RiVo4sbLV8o&list=PLF48AC0919899FFED&index=25&pp=iAQB8AUB',
      author: {
        url: 'https://www.youtube.com/@JGC255',
        channelID: 'UCTdAxCOXA9b_gbWQWHwNL_w',
        name: 'Joe Carter',
      },
      thumbnail:
        'https://i.ytimg.com/vi/RiVo4sbLV8o/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDZf8zyBWRSBva55I80D7c5Hs53qw',
      isLive: false,
      duration: '4:55',
    },
  ],
};

export const playlistState = atom<{ playlist: IPlaylist | undefined }>({
  key: 'playlistState',
  default: {
    playlist: undefined,
  },
});

export const preferencesState = atom<IPreferences | undefined>({
  key: 'preferencesState',
  default: preferencesSelector,
});
