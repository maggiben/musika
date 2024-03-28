import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { playlistState, preferencesState } from '@renderer/states/atoms';
import { TbPlaylist } from 'react-icons/tb';
import { BsClock, BsHandThumbsUp } from 'react-icons/bs';
import { MdApps } from 'react-icons/md';
import { PiTelevisionDuotone } from 'react-icons/pi';
import { SpaceBottom, SpaceRight } from '../Spacing/Spacing';
import { DarwinInputSearch } from '../Form/Form';
import ResizableContainer from './ResizableContainer';
import type { IPlaylist } from 'types/types';

const DraggableRegion = styled.div`
  width: 100%;
  height: 1rem;
  padding-top: ${({ theme }) => theme.spacing.xxl};
  user-select: none;
  -webkit-app-region: drag;
`;

const StyledNav = styled.div`
  width: 100%;
  height: auto;
`;

const StyledNavHeading = styled.h1`
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors['label']};
  font-size: 60%;
`;

const StyledList = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 0px;
  width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const StyledListItem = styled.li`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & [type='radio']:checked ~ label {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.midGray};
  }
  & label {
    width: 100%;
    border-radius: 6px;
    color: ${({ theme }) => theme.colors.lightGray};
    padding: ${({ theme }) => theme.spacing.xxs};
    transition: all 200ms ease-in-out;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    & :nth-child(1) {
      min-width: 1rem;
      min-height: 1rem;
      margin-left: ${({ theme }) => theme.spacing.xs};
    }
  }
`;

const StyledLabel = styled.label`
  flex-basis: auto;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  display: block;
  white-space: nowrap;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
  width: 100%;
  overflow: hidden;
  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const StyledInputRadio = styled.input`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: none;
  border-radius: 0;
  padding: ${({ theme }) => theme.spacing.xs};
  &[type='radio'] {
    display: none;
  }
`;

interface ISideBarItem {
  title: string;
  id: string;
  showSearch?: boolean;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  items: {
    icon: JSX.Element;
    title: string;
    id: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }[];
}

const SideBar = (): JSX.Element => {
  const { t } = useTranslation();
  const [, setPlaylist] = useRecoilState(playlistState);
  const [preferences, setPreferences] = useRecoilState(preferencesState);

  const setSelected = (id: string): void => {
    const selected = id.split(':').slice(1, 2).pop();
    setPreferences((prev) => ({
      ...prev,
      behaviour: {
        ...prev.behaviour,
        sideBar: {
          ...prev.behaviour.sideBar,
          selected,
        },
      },
    }));
  };

  const onPlaylistSelect =
    (playlist: IPlaylist) =>
    async ({ target: { id, checked } }: React.ChangeEvent<HTMLInputElement>) => {
      if (!checked) return;
      const { filePath } = playlist;
      if (filePath) {
        const playlist = await window.playlist.loadPlaylist(filePath);
        setPlaylist((prev) => ({ ...prev, playlist }));
      } else if (playlist.url) {
        setPlaylist((prev) => ({ ...prev, playlist: playlist as IPlaylist }));
      }
      setSelected(id);
    };

  const mainSidePanel: ISideBarItem[] = [
    {
      title: t('library'),
      id: 'library',
      showSearch: true,
      onSearch: () => {},
      items: [
        {
          icon: <BsClock />,
          title: t('recently added'),
          id: 'recently-added',
          onChange: ({ target: { id } }: React.ChangeEvent<HTMLInputElement>) => setSelected(id),
        },
        {
          icon: <PiTelevisionDuotone />,
          title: t('channels'),
          id: 'channels',
          onChange: ({ target: { id } }: React.ChangeEvent<HTMLInputElement>) => setSelected(id),
        },
        {
          icon: <BsHandThumbsUp />,
          title: t('popular'),
          id: 'popular',
          onChange: ({ target: { id } }: React.ChangeEvent<HTMLInputElement>) => setSelected(id),
        },
      ],
    },
    {
      title: t('playlists'),
      id: 'playlists',
      items: [
        {
          icon: <MdApps />,
          title: t('all playlists'),
          id: 'all-playlist',
          onChange: ({ target: { id } }: React.ChangeEvent<HTMLInputElement>) => setSelected(id),
        },
        ...preferences.playlists
          .filter(({ filePath }) => !!filePath)
          .map((playlist) => {
            return {
              icon: <TbPlaylist />,
              id: playlist.id,
              title: playlist.title,
              onChange: onPlaylistSelect(playlist),
            };
          }),
      ],
    },
  ];

  if (preferences.playlists.some(({ filePath }) => !filePath)) {
    mainSidePanel.push({
      title: t('unsaved playlists'),
      id: 'unsaved-playlists',
      items: [
        ...preferences.playlists
          .filter(({ filePath }) => !filePath)
          .map((playlist) => {
            return {
              icon: <TbPlaylist />,
              id: playlist.id,
              title: playlist.title,
              onChange: onPlaylistSelect(playlist),
            };
          }),
      ],
    });
  }

  return (
    <ResizableContainer>
      <div>
        {mainSidePanel.map((group, index) => {
          return (
            <StyledNav key={`${group.id}-${index}`}>
              {index == 0 && <DraggableRegion />}
              {index == 0 && group.showSearch && (
                <>
                  <DarwinInputSearch
                    type="search"
                    id="global-search"
                    style={{ width: '100%' }}
                    placeholder={t('search')}
                    onChange={group.onSearch}
                  />
                  <SpaceBottom size="m" />
                </>
              )}
              <StyledNavHeading>{group.title}</StyledNavHeading>
              <StyledList>
                {group.items.map((item, index) => (
                  <StyledListItem key={`${item.id}-${index}`}>
                    <StyledInputRadio
                      id={`item:${item.id}:${index}`}
                      checked={preferences.behaviour.sideBar?.selected === item.id}
                      type="radio"
                      name={`sidebar-menu-item`}
                      onChange={item.onChange}
                    />
                    <StyledLabel htmlFor={`item:${item.id}:${index}`}>
                      {item.icon}
                      <SpaceRight size="xs" />
                      <span>{item.title}</span>
                      <SpaceRight size="xs" />
                    </StyledLabel>
                  </StyledListItem>
                ))}
              </StyledList>
              <SpaceBottom size="m" />
            </StyledNav>
          );
        })}
      </div>
    </ResizableContainer>
  );
};

export default SideBar;
