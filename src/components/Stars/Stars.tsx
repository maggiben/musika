interface IStarProps {
  stars?: number;
}

const Stars = (props: IStarProps): JSX.Element => {
  const maxStars = 5;
  const makeStars = (stars: number = 0) => {
    return '☆'.repeat(maxStars).split('').fill('★', 0, stars).map(x => {
      let style = x === '★' ? 'full' : 'empty';
      return (<span className={style}>{x}</span>);
    });
  };
  return (<span className="two stars">{makeStars(props.stars)}</span>);
};

export default Stars;