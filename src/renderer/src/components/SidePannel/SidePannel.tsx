import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { playlistState } from '@renderer/states/atoms';
import { TbPlaylist } from 'react-icons/tb';
import { BsStar, BsPersonFill } from 'react-icons/bs';
import { SpaceBottom, SpaceRight } from '../Spacing/Spacing';

const SidePannelContainer = styled.div`
  height: 100%;
  border-right: 1px solid black;
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.s};
`;

const StyledNav = styled.div`
  width: 100%;
  height: auto;
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

const SidePannel = (): JSX.Element => {
  const { t } = useTranslation();
  const [{ playlist }, setPlaylist] = useRecoilState(playlistState);
  return (
    <SidePannelContainer data-testid="sidepannel">
      <StyledNav>
        <StyledNavHeading>Library</StyledNavHeading>
        <StyledList>
          <StyledListItem>
            <StyledInputRadio id="my-playlist" type="radio" name="my-playlist" />
            <StyledLabel htmlFor="my-playlist">
              <TbPlaylist style={{color: 'violet'}}/>
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
        </StyledList>
      </StyledNav>
    </SidePannelContainer>
  );
};

export default SidePannel;
