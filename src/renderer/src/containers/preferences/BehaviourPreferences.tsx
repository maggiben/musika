import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { preferencesState } from '@states/atoms';
import languages from '@locale/languages.json';

import {
  StyledForm,
  StyledLabel,
  StyledDFieldset,
  InputPairContainer,
  StyledSelect,
  InputGroup,
  StyledButton,
  FormControl,
} from '@renderer/components/Form/Form';

const BehaviourPreferences = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const handleChangeLanguage = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    const { value } = event.target;
    try {
      const newPreferences = { ...preferences, behaviour: { language: value } };
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

  const handleEnableLogs = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const { checked } = event.target;
    try {
      const newPreferences = {
        ...preferences,
        advanced: {
          ...preferences?.advanced,
          logs: {
            ...preferences?.advanced?.logs,
            enabled: checked,
          },
        },
      };
      setPreferences(newPreferences);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAutomatedUpdate = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const { checked } = event.target;
    try {
      const newPreferences = {
        ...preferences,
        advanced: {
          ...preferences?.advanced,
          update: {
            ...preferences?.advanced?.update,
            automatic: checked,
          },
        },
      };
      setPreferences(newPreferences);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <StyledForm
        data-testid="behaviour-preferences"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <StyledDFieldset>
          <legend>{t('interface')}</legend>
          <i>{t('restart required message')}</i>
          <div>
            <InputPairContainer>
              <StyledLabel htmlFor="language">{t('language')}</StyledLabel>
              <StyledSelect
                className="form-select"
                id="language"
                defaultValue={preferences?.behaviour?.language}
                onChange={handleChangeLanguage}
              >
                {supportedLangs.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.english}
                  </option>
                ))}
              </StyledSelect>
            </InputPairContainer>
          </div>
        </StyledDFieldset>
        <StyledDFieldset>
          <legend>{t('desktop')}</legend>
          <div>
            <InputPairContainer>
              <input type="checkbox" id="auto-update" onChange={handleAutomatedUpdate}></input>
              <StyledLabel htmlFor="auto-update">{t('check for updates')}</StyledLabel>
            </InputPairContainer>
          </div>
        </StyledDFieldset>
        <StyledDFieldset disabled={!preferences?.advanced?.logs?.enabled}>
          <legend>
            <input
              type="checkbox"
              id="enable-logs"
              defaultChecked={Boolean(preferences?.advanced?.logs?.savePath)}
              onChange={handleEnableLogs}
            ></input>
            <label htmlFor="enable-logs">{t('log file')}</label>
          </legend>
          <div>
            <InputPairContainer>
              <StyledLabel htmlFor="savePath">{t('save files to')}</StyledLabel>
              <InputGroup>
                <FormControl
                  type="text"
                  id="savePath"
                  name="savePath"
                  className="form-control"
                  defaultValue={preferences?.advanced?.logs?.savePath}
                  placeholder={t('save files to')}
                />
                <StyledButton type="button" id="button" onClick={openFolderDialog}>
                  {t('open folder')}
                </StyledButton>
              </InputGroup>
            </InputPairContainer>
          </div>
        </StyledDFieldset>
      </StyledForm>
    </>
  );
};

export default BehaviourPreferences;
