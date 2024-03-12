import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { playlistState } from '@renderer/states/atoms';
import { TbPlaylist } from 'react-icons/tb';
import { BsStar, BsPersonFill } from 'react-icons/bs';
import { SpaceBottom, SpaceRight } from '../Spacing/Spacing';

const SideBarContainer = styled.div`
  height: 100%;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.s};
  position: relative;
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
    padding-left: ${({ theme }) => theme.spacing.s};
    padding-right: ${({ theme }) => theme.spacing.s};
    transition: all 200ms ease-in-out;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    & :nth-child(1) {
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
  const [sidebarWidth, setSidebarWidth] = useState(268);
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
      style={{ width: sidebarWidth }}
      ref={sidebarRef}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div>
        <StyledNav>
          <StyledNavHeading>Library</StyledNavHeading>
          <StyledList>
            <StyledListItem>
              <StyledInputRadio id="my-playlist" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist">
                <TbPlaylist style={{ color: 'violet' }} />
                <SpaceRight size="xs" />
                Recenttly Added
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-1" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-1">
                <BsPersonFill />
                <SpaceRight size="xs" />
                Artist
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-2" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-2">
                <BsStar />
                <SpaceRight size="xs" />
                Albums
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-3" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-3">
                <BsStar />
                <SpaceRight size="xs" />
                Songs
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-4" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-4">
                <BsStar />
                <SpaceRight size="xs" />
                Music Videos
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
              <StyledInputRadio id="my-playlist-x1" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-x1">
                <TbPlaylist />
                <SpaceRight size="xs" />
                My Playlist
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-12" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-12">
                <TbPlaylist style={{ color: 'red' }} />
                <SpaceRight size="xs" />
                Other Playlist
                <SpaceRight size="xs" />
              </StyledLabel>
            </StyledListItem>
            <StyledListItem>
              <StyledInputRadio id="my-playlist-12" type="radio" name="my-playlist" />
              <StyledLabel htmlFor="my-playlist-12">
                <TbPlaylist style={{ color: 'red' }} />
                <SpaceRight size="xs" />
                My super very long playlist title that cannot fit in a SideBar
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