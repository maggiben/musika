import coverflowImage from '@assets/images/coverflow.svg';
import styled from 'styled-components';

const StyledIcon = styled.img<{
  color?: string;
}>`
  background-color: ${({ theme, color }) => color ?? theme.colors.white};
  mask-image: url(${coverflowImage});
  mask-position: center;
  mask-repeat: no-repeat;
  mask-size: contain;
  width: 32px;
  height: 32px;
`;

interface IIconProps {
  width?: number;
  height?: number;
  alt?: string;
}

export const Coverflow = (props: IIconProps): JSX.Element => {
  return (
    <>
      <StyledIcon
        color="#d21d30"
        src={coverflowImage}
        width={props.width ?? 128}
        height={props.height ?? 128}
        alt={props.alt}
      />
    </>
  );
};
