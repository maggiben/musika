import styled from 'styled-components';

export const GridContainer = styled.ul`
  box-sizing: border-box;
  list-style: none;
  padding: 0px;
  max-width: 100%;
  margin: 0px;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--thumbnail-size, 220px), 1fr));
  grid-gap: ${({ theme }) => theme.spacing.s};
`;

export const GridItem = styled.li`
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.xxs};
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  color: ${({ theme }) => theme.colors.lightGray};
  margin: 0px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.softGray};
    color: white;
  }
`;

export const GridThumbnail = styled.div`
  position: relative;
`;

export const GridFigure = styled.figure`
  padding: 0px;
  margin: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  line-height: 1em;
  & ${GridThumbnail} > img {
    border-radius: ${({ theme }) => theme.borderRadius.xs};
    max-width: max(var(--thumbnail-size, 220px), 100%);
  }
`;

export const GridFigCaption = styled.figcaption`
  padding: 0px;
  margin: 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const GridThumbnailInfo = styled.span`
  position: absolute;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius.xxs};
  background-color: rgba(0, 0, 0, 0.75);
  right: calc(0px + ${({ theme }) => theme.spacing.xs});
  bottom: calc(0px + ${({ theme }) => theme.spacing.xs});
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xxs};
`;
