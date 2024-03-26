import React from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import useDownload from '@hooks/useDownload';
import { playlistState } from '@states/atoms';
import { selectedItemsSelector } from '@states/selectors';
import useContextMenu from '@renderer/hooks/useContextMenu';
import sortPlaylist from './sortPlaylist';
import { ListItem, ListHeader } from './ListItem';

/* for testing */
// import useFakeProgress from '@hooks/useFakeProgress';

const ListWrapper = styled.ul`
  flex-grow: 1;
  min-height: 100vh;
  list-style: none;
  padding: 0px;
  margin: 0px;
  width: 100%;
  overflow-y: scroll;
`;

const List = (): JSX.Element | null => {
  useContextMenu<{
    id: string;
    options?: Record<string, unknown>;
  }>(
    (message) => {
      window.commands.modal('media-info', { width: 600, height: 660, ...message.options });
    },
    ['contextmenu.playlist-item.get-media-info'],
  );

  const [{ playlist, sortOptions }] = useRecoilState(playlistState);
  const [, setSelectedItems] = useRecoilState(selectedItemsSelector);
  const { progress } = useDownload();

  /* for testing */
  // const progress = useFakeProgress({
  //   items: playlist?.items ?? [],
  // });

  const handleItemSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!playlist) return;
    const { checked } = event.target;
    const [id] = event.target.getAttribute('data-item-selector')!.split(':');
    const selected = playlist.items.map((item) =>
      item.id === id ? checked : item.selected ?? false,
    );
    setSelectedItems(selected);
  };

  return playlist?.items ? (
    <ListWrapper data-testid="list-wrapper">
      <ListHeader />
      {sortPlaylist(playlist.items, sortOptions).map((item, index) => (
        <ListItem
          key={item.id}
          item={item}
          index={index}
          progress={progress?.[item.id]}
          total={playlist.items.length}
          handleItemSelect={handleItemSelect}
        />
      ))}
    </ListWrapper>
  ) : null;
};

export default List;
