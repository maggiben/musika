import React, { useState } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import useDownload from '@hooks/useDownload';
import { playlistState, playerState as currentPlayerState } from '@states/atoms';
import { selectedItemsSelector } from '@states/selectors';
import useContextMenu from '@renderer/hooks/useContextMenu';
import sortPlaylist from './sortPlaylist';
import { ListItem, ListHeader } from './ListItem';

/* for testing */
// import useFakeProgress from '@hooks/useFakeProgress';

const ListWrapper = styled.ul`
  flex-grow: 1;
  height: 100%;
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

  const playerState = useRecoilValue(currentPlayerState);
  const [clickedItemId, setClickedItemId] = useState(
    playerState.queue[playerState.queueCursor]?.id,
  );
  const [{ playlist, sortOptions }] = useRecoilState(playlistState);
  const [, setSelectedItems] = useRecoilState(selectedItemsSelector);
  const { progress } = useDownload([playlist]);

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

  const onItemClick = (id: string): void => {
    if (!id || clickedItemId === id) return;
    setClickedItemId(id);
  };

  return playlist?.items ? (
    <ListWrapper data-testid="list-wrapper">
      <ListHeader />
      {sortPlaylist(playlist.items, sortOptions).map((item, index) => (
        <ListItem
          key={item.id}
          item={item}
          index={index}
          clickedItemId={clickedItemId}
          onItemClick={onItemClick}
          progress={progress?.[item.id]}
          total={playlist.items.length}
          handleItemSelect={handleItemSelect}
        />
      ))}
    </ListWrapper>
  ) : null;
};

export default List;
