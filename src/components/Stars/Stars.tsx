import styled from 'styled-components';

const StarsContainer = styled.span`
  color: #484848;
  display: flex;
  flex-flow: row;
  font-weight: lighter;
  cursor: pointer;
  & .full {
    color: #d21d30;
  }
`;
interface IStarProps {
  stars?: number;
}

const Stars = (props: IStarProps): JSX.Element => {
  const maxStars = 5;
  const makeStars = (stars: number = 0) => {
    return '☆'.repeat(maxStars).split('').fill('★', 0, stars).map((x, index) => {
      let style = x === '★' ? 'full' : 'empty';
      return (<span className={style} key={index}>{x}</span>);
    });
  };
  return (<StarsContainer>{makeStars(props.stars)}</StarsContainer>);
};

export default Stars;