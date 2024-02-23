import styled from 'styled-components';


const SearchBarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SearchTerm = styled.input`
  width: 100%;
  padding-left: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.color};
  margin: ${({ theme }) => theme.spacing.xs};
  border: 0px solid transparent;
  height: 118px;
  font-size: 40px;
  transition: all .2s ease;
  &::placeholder {
    color: ${({ theme }) => theme.color};
  }
  &:focus {
    outline: none;
  }
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    border-radius: 50em;
    background: url(https://pro.fontawesome.com/releases/v5.10.0/svgs/solid/times-circle.svg) no-repeat 50% 50%;
    background-size: contain;
    opacity: 0;
    pointer-events: none;
  }
  &:focus::-webkit-search-cancel-button {
    opacity: .3;
    pointer-events: all;
  }

`;

export const SearchBar = () => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.log('search', value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key pressed:', event.key);
  };

  return (
    <SearchBarWrapper data-testid="search-wrapper">
      <SearchTerm type="search" placeholder="What are you looking for?" data-testid="search-input" onChange={handleOnChange} onKeyDown={handleKeyDown}/>
    </SearchBarWrapper>
  );
}

const Download = () => {
  return (
    <SearchBar />
  );
};

export default Download;