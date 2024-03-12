import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { playlistState } from '@renderer/states/atoms';
import { TbPlaylist } from 'react-icons/tb';
import { BsStar, BsPersonFill } from 'react-icons/bs';
import { MdApps } from 'react-icons/md';
import { SpaceBottom, SpaceRight } from '../Spacing/Spacing';
import { DarwinInputSearch } from '../Form/Form';

interface SideBarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  $sidebarwidth: number | string;
}

const SideBarContainer = styled.div<SideBarContainerProps>`
  --sidebar-width: ${({ $sidebarwidth }) => $sidebarwidth}px;
  height: 100%;
  width: var(--sidebar-width);
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.s};
  position: relative;
  user-select: none;
`;

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

const StyledResizer = styled.div`
  width: 1px;
  height: 100vh;
  background-color: black;
  position: absolute;
  top: 0;
  left: calc(100% - 1px);
  cursor: ew-resize;
`;

const StyledNavHeading = styled.h1`
  text-transform: uppercase;
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

const mainSidePanel = [
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
        title: 'Artist',
        id: 'artist',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          console.log('Artist', event);
        },
      },
      {
        icon: <BsStar />,
        title: 'Albums',
        id: 'albums',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          console.log('Albums', event);
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
        icon: <TbPlaylist style={{ color: 'violet' }} />,
        title: 'All Playlists',
        id: 'all-playlist',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          console.log('menu 1', event);
        },
      },
      {
        icon: <TbPlaylist style={{ color: 'red' }} />,
        title: 'My Playlist',
        id: '234523452345',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          console.log('mine', event);
        },
      },
      {
        icon: <TbPlaylist style={{ color: 'blue' }} />,
        title: 'My super very long playlist title that cannot fit in a SideBar',
        id: 'adsfasdfasdf',
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          console.log('Albums', event);
        },
      },
    ],
  },
];

const SideBar = (): JSX.Element => {
  const { t } = useTranslation();
  const [{ playlist }, setPlaylist] = useRecoilState(playlistState);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        const rect = sidebarRef.current?.getBoundingClientRect();
        rect && setSidebarWidth(mouseMoveEvent.clientX - rect.left);
      }
    },
    [isResizing],
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // setSelectedRadio(event.target.value);
    console.log('event: ', event);
  };

  function isArrayofArrays(arr) {
    return Array.isArray(arr) && arr.every((innerArr) => Array.isArray(innerArr));
  }

  function isArrayofObjects(arr) {
    return (
      Array.isArray(arr) &&
      arr.every((obj) => typeof obj === 'object' && obj !== null && !Array.isArray(obj))
    );
  }

  return (
    <SideBarContainer
      data-testid="sidebar"
      $sidebarwidth={sidebarWidth}
      ref={sidebarRef}
      onMouseDown={(e) => isResizing && e.preventDefault()}
    >
      <div>
        {mainSidePanel.map((group, index) => {
          return (
            <>
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
                        name={`sidebar-items`}
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
              </StyledNav>
              <SpaceBottom size="m" />
            </>
          );
        })}
      </div>
      <StyledResizer onMouseDown={startResizing} data-testid="sidebar-resizer" />
    </SideBarContainer>
  );
};

export default SideBar;
