import styled from 'styled-components';
export { default as ToggleSwitch } from './ToggleSwitch';

export const StyledLabel = styled.label`
  flex-basis: auto;
  width: 100%;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.s};
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
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing.xxs};
  }
`;

export const StyledForm = styled.form`
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
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
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.s};
  line-height: ${({ theme }) => theme.lineHeights.l};
  color: ${({ theme }) => theme.colors.white};
  color: ${({ theme, disabled }) => (disabled ? theme.colors.lightGray : theme.colors.white)};
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.darkGray : theme.colors.softGray};
  border: 0;
  background-clip: padding-box;
  appearance: none;
  border-radius: 0;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
`;

export const InputGroupText = styled.span`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  background-color: ${({ theme }) => theme.colors.midGray};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  white-space: nowrap;
  border: 0;
  border-radius: 0;
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

export const StyledSelect = styled.select`
  display: block;
  width: 100%;
  margin-left: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.s};
  line-height: ${({ theme }) => theme.lineHeights.l};
  color: ${({ theme }) => theme.colors.white};
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  /* background-blend-mode: difference; */
  border: 0px;
  border-radius: 0px;
  appearance: none;
  background-clip: padding-box;
  &:focus {
    outline: 0;
  }
`;
