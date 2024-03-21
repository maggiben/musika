import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { playlistState, preferencesState } from '@renderer/states/atoms';
import { TbPlaylist } from 'react-icons/tb';
import { BsStar, BsPersonFill } from 'react-icons/bs';
import { MdApps } from 'react-icons/md';
import { SpaceBottom, SpaceRight } from '../Spacing/Spacing';
import { DarwinInputSearch } from '../Form/Form';
import ResizableContainer from './ResizableContainer';

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
  const preferences = useRecoilValue(preferencesState);

  const mainSidePanel: ISideBarItem[] = [
    {
      title: 'Library',
      id: 'library',
      showSearch: true,
      onSearch: () => {},
      items: [
        {
          icon: <TbPlaylist style={{ color: 'violet' }} />,
          title: 'Recently Added',
          id: 'recently-added',
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log('menu 1', event);
          },
        },
        {
          icon: <BsPersonFill style={{ color: 'yellow' }} />,
          title: 'Channels',
          id: 'Channels',
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log('Channels', event);
          },
        },
        {
          icon: <BsStar />,
          title: 'Popular',
          id: 'popular',
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log('Popular', event);
          },
        },
        {
          icon: <BsStar />,
          title: 'Songs',
          id: 'songs',
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log('Songs', event);
          },
        },
        {
          icon: <BsStar />,
          title: 'Music Music',
          id: 'music-videos',
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log('Music Videos', event);
          },
        },
      ],
    },
    {
      title: 'Playlists',
      id: 'playlists',
      items: [
        {
          icon: <MdApps />,
          title: 'All Playlists',
          id: 'all-playlist',
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log('menu 1', event);
          },
        },
        ...preferences.playlists.map((savedPlaylist) => {
          return {
            icon: <TbPlaylist />,
            id: savedPlaylist.id,
            title: savedPlaylist.title,
            onChange: async (event: React.ChangeEvent<HTMLInputElement>) => {
              if (!event.target.checked) return;
              const playlist = await window.playlist.loadPlaylist(savedPlaylist.filePath);
              console.log('loaded', playlist);
              setPlaylist((prev) => ({ ...prev, playlist }));
            },
          };
        }),
      ],
    },
  ];

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
                    placeholder="Search"
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
                      id={`item-${item.id}-${index}`}
                      type="radio"
                      name={`sidebar-menu-item`}
                      onChange={item.onChange}
                    />
                    <StyledLabel htmlFor={`item-${item.id}-${index}`}>
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
