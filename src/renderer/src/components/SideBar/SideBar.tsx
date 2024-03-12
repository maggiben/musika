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

  return (
    <SideBarContainer
      data-testid="sidebar"
      $sidebarwidth={sidebarWidth}
      ref={sidebarRef}
      onMouseDown={(e) => isResizing && e.preventDefault()}
    >
      <div>
        <StyledNav>
          <DarwinInputSearch
            type="search"
            id="global-search"
            style={{ width: '100%' }}
            placeholder="Search"
          />
          <SpaceBottom size="m" />
          <StyledNavHeading>Library</StyledNavHeading>
          <StyledList>
            <StyledListItem>
              <StyledInputRadio id="my-playlist" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist">
                <TbPlaylist style={{ color: 'violet' }} />
                <SpaceRight size="xs" />
                <span>Recenttly Added</span>
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-1" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-1">
                <BsPersonFill />
                <SpaceRight size="xs" />
                <span>Artist</span>
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-2" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-2">
                <BsStar />
                <SpaceRight size="xs" />
                <span>Albums</span>
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-3" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-3">
                <BsStar />
                <SpaceRight size="xs" />
                <span>Songs</span>
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-4" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-4">
                <BsStar />
                <SpaceRight size="xs" />
                <span>Music Videos</span>
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
          </StyledList>
        </StyledNav>
        <SpaceBottom size="m" />
        <StyledNav>
          <StyledNavHeading>Playlists</StyledNavHeading>
          <StyledList>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-x1all" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-x1all">
                <MdApps />
                <SpaceRight size="xs" />
                <span>All Playlists</span>
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-x1" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-x1">
                <TbPlaylist />
                <SpaceRight size="xs" />
                <span>My Playlist</span>
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-12" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-12">
                <TbPlaylist style={{ color: 'red' }} />
                <SpaceRight size="xs" />
                <span>Other Playlist</span>
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-13" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-13">
                <TbPlaylist style={{ color: 'red' }} />
                <SpaceRight size="xs" />
                <span>My super very long playlist title that cannot fit in a SideBar</span>
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
          </StyledList>
        </StyledNav>
      </div>
      <StyledResizer onMouseDown={startResizing} data-testid="sidebar-resizer" />
    </SideBarContainer>
  );
};

export default SideBar;
