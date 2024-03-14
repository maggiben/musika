import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { preferencesState } from '@states/atoms';
import styled from 'styled-components';
import { BsFillFolderFill } from 'react-icons/bs';
import languages from '@locale/languages.json';
import {
  StyledForm,
  StyledLabel,
  StyledDFieldset,
  InputPairContainer,
  InputGroup,
  ToggleSwitch,
  DarwinSelect,
  DarwinInput,
  DarwinButton,
} from '@renderer/components/Form/Form';
import { SpaceBottom, SpaceRight } from '@components/Spacing/Spacing';

export const PreferencesForm = styled(StyledForm)`
  padding: ${({ theme }) => theme.spacing.s};
`;

const BehaviourPreferences = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);

  const handleChangeLanguage = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    const { value } = event.target;
    try {
      const newPreferences = {
        ...preferences,
        behaviour: { ...preferences.behaviour, language: value },
      };
      i18n.changeLanguage(value);
      setPreferences(newPreferences);
    } catch (error) {
      console.error(error);
    }
  };

  const openFolderDialog = async (): Promise<void> => {
    const result = await window.commands.dialogs({
      defaultPath: preferences?.advanced?.logs?.savePath,
      properties: ['openDirectory', 'promptToCreate'],
    });
    if (!result.canceled) {
      const savePath = result.filePaths[0];
      !result.canceled &&
        setPreferences({
          ...preferences,
          advanced: {
            ...preferences?.advanced,
            logs: {
              ...preferences?.advanced?.logs,
              savePath,
            },
          },
        });
    }
  };

  const supportedLangs = languages.filter((language) => {
    const { supportedLngs } = i18n.options;
    return supportedLngs && Array.isArray(supportedLngs) && supportedLngs.includes(language.code);
  });

  return (
    <>
      <StyledDFieldset>
        <legend>{t('interface')}</legend>
        <i>{t('restart required message')}</i>
        <div>
          <InputPairContainer>
            <StyledLabel htmlFor="language">{t('language')}</StyledLabel>
            <DarwinSelect
              className="form-select"
              id="language"
              name="language"
              defaultValue={preferences?.behaviour?.language}
              onChange={handleChangeLanguage}
              style={{ flexBasis: '100%' }}
            >
              {supportedLangs.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.english}
                </option>
              ))}
            </DarwinSelect>
          </InputPairContainer>
        </div>
      </StyledDFieldset>
      <SpaceBottom size="s" />
      <StyledDFieldset>
        <legend>{t('desktop')}</legend>
        <div>
          <InputPairContainer>
            <StyledLabel htmlFor="ui-theme">{t('ui theme')}</StyledLabel>
            <DarwinSelect
              className="form-select"
              id="ui-theme"
              name="ui-theme"
              defaultValue={preferences?.behaviour?.language}
              style={{ flexBasis: '100%' }}
            >
              {['light', 'dark'].map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </DarwinSelect>
          </InputPairContainer>
          <InputPairContainer>
            <StyledLabel htmlFor="auto-update">{t('check for updates')}</StyledLabel>
            <ToggleSwitch
              id="auto-update"
              name="auto-update"
              defaultChecked={preferences.advanced?.update?.automatic}
            />
          </InputPairContainer>
          <InputPairContainer>
            <StyledLabel htmlFor="notifications">{t('enable notifications')}</StyledLabel>
            <ToggleSwitch
              id="notifications"
              name="notifications"
              defaultChecked={preferences.behaviour?.notifications?.enabled}
            />
          </InputPairContainer>
        </div>
      </StyledDFieldset>
      <SpaceBottom size="s" />
      <StyledDFieldset>
        <legend>{t('search options')}</legend>
        <div>
          <InputPairContainer>
            <StyledLabel htmlFor="default-search">{t('default search')}</StyledLabel>
            <DarwinInput
              type="text"
              id="default-search"
              name="default-search"
              defaultValue={preferences.behaviour?.search?.defaultSearch}
              placeholder={t('save files to')}
              style={{ flexBasis: '100%' }}
            />
          </InputPairContainer>
          <InputPairContainer>
            <StyledLabel htmlFor="safe-search">{t('safe search')}</StyledLabel>
            <ToggleSwitch
              id="safe-search"
              name="safe-search"
              defaultChecked={preferences.behaviour?.search?.safeSearch}
            />
          </InputPairContainer>
          <InputPairContainer>
            <StyledLabel htmlFor="search-limit">{t('limit')}</StyledLabel>
            <DarwinInput
              type="number"
              id="search-limit"
              name="search-limit"
              min="1"
              max={Infinity}
              defaultValue={preferences.behaviour?.search?.limit}
              placeholder={t('limits the pulled items')}
              style={{ flexBasis: '100%' }}
            />
          </InputPairContainer>
          <InputPairContainer>
            <StyledLabel htmlFor="filter-search">
              {t('filter for a specific type of item')}
            </StyledLabel>
            <DarwinSelect
              id="filter-search"
              name="filter-search"
              className="form-select"
              defaultValue={preferences?.behaviour?.search?.type}
              style={{ flexBasis: '100%' }}
            >
              {['video', 'playlist'].map((options, index) => (
                <option key={index} value={options}>
                  {options}
                </option>
              ))}
            </DarwinSelect>
          </InputPairContainer>
        </div>
      </StyledDFieldset>
      <SpaceBottom size="s" />
      <StyledDFieldset disabled={!preferences?.advanced?.logs?.enabled}>
        <legend style={{ display: 'flex' }}>
          <input
            type="checkbox"
            id="enable-logs"
            name="enable-logs"
            defaultChecked={preferences?.advanced?.logs.enabled}
          ></input>
          <SpaceRight size="xs" />
          <label htmlFor="enable-logs">{t('log file')}</label>
        </legend>
        <div>
          <InputPairContainer>
            <StyledLabel htmlFor="savePath">{t('save files to')}</StyledLabel>
            <InputGroup>
              <DarwinInput
                type="text"
                id="savePath"
                name="savePath"
                defaultValue={preferences?.advanced?.logs?.savePath}
                placeholder={t('save files to')}
                style={{ flex: 1 }}
              />
              <SpaceRight size="s" />
              <DarwinButton type="button" id="button" onClick={openFolderDialog}>
                <BsFillFolderFill />
              </DarwinButton>
            </InputGroup>
          </InputPairContainer>
        </div>
      </StyledDFieldset>
    </>
  );
};

export default BehaviourPreferences;
