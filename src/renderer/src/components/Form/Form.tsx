import styled, { css } from 'styled-components';
export { default as ToggleSwitch } from './ToggleSwitch';

export const StyledLabel = styled.label`
  flex-basis: auto;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.s};
  color: ${({ theme }) => theme.colors['secondary-label']};
  display: block;
  white-space: nowrap;
  cursor: pointer;
  white-space: nowrap;
  position: relative;
`;

export const InputPairContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing.xxs};
  }
  & > label {
    width: 100%;
  }
`;

export const StyledForm = styled.form`
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
`;

export const StyledDFieldset = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.colors['control']};
  margin: 0px;
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  &:disabled button,
  &:disabled input {
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.midGray};
  }
  & > legend {
    color: ${({ theme }) => theme.colors['label']};
  }
  &:disabled > legend {
    & input {
      box-shadow: inherit;
    }
  }
`;

export const InputGroup = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  flex-basis: 100%;
`;

export const FormControl = styled.input`
  display: block;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.s};
  line-height: ${({ theme }) => theme.lineHeights.l};
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

// Styled textarea extending from BaseInput
export const StyledTextarea = styled(FormControl).attrs({ as: 'textarea' })`
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
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
    background-color 0.1s ease-in-out,
    border-color 0.1s ease-in-out;
  &:not([disabled]):hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
  &:not([disabled]):active {
    background-color: ${({ theme }) => theme.colors.midGray};
  }
  &[disabled] {
    color: ${({ theme }) => theme.colors.lightGray};
    cursor: inherit;
  }
`;

export const DarwinButton = styled.button`
  --active-color: ${({ theme }) => theme.colors.accentColor};
  --active-color-shadow: color-mix(in srgb, var(--active-color), #00000080 50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.m};
  border-radius: 6px;
  line-height: 1;
  border: none;
  white-space: nowrap;
  box-shadow:
    0px 0.5px 1px rgba(0, 0, 0, 0.1),
    inset 0px 0.5px 0.5px rgba(255, 255, 255, 0.5),
    0px 0px 0px 0.5px rgba(0, 0, 0, 0.12);
  &:not([disabled]):focus {
    box-shadow:
      inset 0px 0.8px 0px -0.25px rgba(255, 255, 255, 0.2),
      0px 0.5px 1px rgba(0, 0, 0, 0.1),
      0px 0px 0px 3.5px var(--active-color-shadow);
    outline: 0;
  }
  &:not([disabled]):active {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
  &[disabled] {
    color: ${({ theme }) => theme.colors.lightGray};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.midGray};
    cursor: inherit;
  }
`;

export const DarwinInput = styled.input`
  --active-color: ${({ theme }) => theme.colors.accentColor};
  --active-color-shadow: color-mix(in srgb, var(--active-color), #00000080 50%);
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.xs};
  border: 0;
  width: 100%;
  box-shadow:
    0px 0.5px 1px rgba(0, 0, 0, 0.1),
    0px 0.5px 0.5px rgba(255, 255, 255, 0.5),
    0px 0px 0px 0.5px rgba(0, 0, 0, 0.12);
  &:focus {
    box-shadow:
      inset 0px 0.8px 0px -0.25px rgba(255, 255, 255, 0.2),
      0px 0.5px 1px rgba(0, 0, 0, 0.1),
      0px 0px 0px 3.5px var(--active-color-shadow);
    outline: 0;
  }
`;

export const DarwinInputSearch = styled(DarwinInput)`
  padding-left: ${({ theme }) => theme.spacing.xxl};
  line-height: 1rem;
  background: field
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23f0f0f0' d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E")
    no-repeat ${({ theme }) => theme.spacing.xs} center;
`;

export const CircularButton = styled(StyledButton)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

export const ClearButton = styled(StyledButton)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.lightGray};
  &:not([disabled]):hover {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.white};
  }
  &:not([disabled]):active {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.white};
  }
  &[disabled] {
    color: ${({ theme }) => theme.colors.softGray};
    cursor: inherit;
  }
`;

export const ContextMenuButton = styled(ClearButton)`
  border-radius: 6px;
  display: flex;
  &:not([disabled]):hover {
    background-color: ${({ theme }) => theme.colors.midGray};
  }
  &:not([disabled]):active {
    background-color: ${({ theme }) => theme.colors.midGray};
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

const selectChevron = (color: string, background: string): ReturnType<typeof css> => css`
  /* eslint-disable-next-line prettier/prettier */
  background-image: url('data:image/svg+xml,<%3Fxml version="1.0" encoding="UTF-8" standalone="no"%3F><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 61.44 61.44" stroke-linecap="round" stroke-linejoin="round" height="512" width="512" version="1.1" id="svg2" sodipodi:docname="select-chevron-colorized.svg" xml:space="preserve" inkscape:version="1.3.2 (091e20e, 2023-11-25)" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><defs id="defs2" /><sodipodi:namedview id="namedview2" pagecolor="%23ffffff" bordercolor="%23000000" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="%23d1d1d1" showgrid="true" inkscape:zoom="0.78712434" inkscape:cx="207.08291" inkscape:cy="327.14018" inkscape:window-width="1472" inkscape:window-height="830" inkscape:window-x="0" inkscape:window-y="37" inkscape:window-maximized="1" inkscape:current-layer="g3"><inkscape:grid id="grid3" units="px" originx="0" originy="0" spacingx="0.12" spacingy="0.12" empcolor="%230099e5" empopacity="0.30196078" color="%230099e5" opacity="0.14901961" empspacing="5" dotted="false" gridanglex="30" gridanglez="30" visible="true" /></sodipodi:namedview><g inkscape:groupmode="layer" id="layer1" inkscape:label="background"><rect style="display:inline;fill:${encodeURIComponent(background)};fill-opacity:1;stroke-width:0;stroke-linejoin:round;paint-order:stroke fill markers" id="rect3" width="61.439999" height="61.439999" x="4.4408921e-16" y="4.4408921e-16" rx="13.44" ry="14.4" inkscape:label="shield" /></g><g inkscape:groupmode="layer" id="layer4" inkscape:label="up-down-chevrons" style="display:inline"><g style="display:inline;fill:currentColor;stroke:%23000000;stroke-width:0;stroke-opacity:1" id="g3" transform="matrix(3.8393492,0,0,3.8393492,0.00570927,0.00520568)" inkscape:label="chevrons"><path fill-rule="evenodd" d="m 3.646,9.146 a 0.5,0.5 0 0 1 0.708,0 L 8,12.793 11.646,9.146 a 0.5006316,0.5006316 0 0 1 0.708,0.708 l -4,4 a 0.5,0.5 0 0 1 -0.708,0 l -4,-4 a 0.5,0.5 0 0 1 0,-0.708 z m 0,-2.292 a 0.5,0.5 0 0 0 0.708,0 L 8,3.207 11.646,6.854 a 0.5006316,0.5006316 0 0 0 0.708,-0.708 l -4,-4 a 0.5,0.5 0 0 0 -0.708,0 l -4,4 a 0.5,0.5 0 0 0 0,0.708 z" id="path1-2" style="fill:${encodeURIComponent(color)};stroke:%23100000;stroke-opacity:1;fill-opacity:1" inkscape:label="path" /></g></g><g inkscape:groupmode="layer" id="layer3" inkscape:label="org" /></svg>');
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.s} center;
  background-size: 16px 16px;
`;

export const DarwinSelect = styled.select`
  --active-color: ${({ theme }) => theme.colors.accentColor};
  --active-color-shadow: color-mix(in srgb, var(--active-color), #00000080 50%);
  position: relative;
  display: block;
  line-height: 1rem;
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => selectChevron('field', theme.colors.accentColor)};
  border: 0px;
  border-radius: 0px;
  appearance: none;
  background-clip: padding-box;
  display: flex;
  background-color: field;
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.m};
  border-radius: 6px;
  border: none;
  box-shadow:
    0px 0.5px 1px rgba(0, 0, 0, 0.1),
    inset 0px 0.5px 0.5px rgba(255, 255, 255, 0.5),
    0px 0px 0px 0.5px rgba(0, 0, 0, 0.12);
  &:focus {
    box-shadow:
      inset 0px 0.8px 0px -0.25px rgba(255, 255, 255, 0.2),
      0px 0.5px 1px rgba(0, 0, 0, 0.1),
      0px 0px 0px 3.5px var(--active-color-shadow);
    outline: 0;
  }
  &[disabled] {
    color: ${({ theme }) => theme.colors.lightGray};
    box-shadow: none;
    cursor: inherit;
  }
`;
