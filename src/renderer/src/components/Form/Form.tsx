import styled from 'styled-components';

export const StyledLabel = styled.label`
  flex-basis: auto;
  width: 100%;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  display: block;
  white-space: nowrap;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
`;

export const InputPairContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export const StyledForm = styled.form`
  width: 100%;
  height: 100%;
`;

export const StyledDFieldset = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.colors.midGray};
`;

export const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
  & .form-control,
  .form-select {
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    min-width: 0;
  }
`;

export const FormControl = styled.input`
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: white;
  border: 0;
  background-clip: padding-box;
  appearance: none;
  border-radius: 0;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
`;

export const StyledButton = styled.button`
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 0;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  border-radius: 0;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;
