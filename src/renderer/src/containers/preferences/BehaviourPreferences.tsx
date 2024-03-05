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
  ToggleSwitch,
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
              {/* <input type="checkbox" id="auto-update" onChange={handleAutomatedUpdate}></input> */}
              <StyledLabel htmlFor="auto-update">{t('check for updates')}</StyledLabel>
              <ToggleSwitch
                id="auto-update"
                checked={preferences.advanced?.update?.automatic}
                onChange={handleAutomatedUpdate}
              />
            </InputPairContainer>
          </div>
        </StyledDFieldset>
        <StyledDFieldset>
          <legend>{t('search options')}</legend>
          <div>
            <InputPairContainer>
              <StyledLabel htmlFor="default-search">{t('default search')}</StyledLabel>
              <InputGroup>
                <FormControl
                  type="text"
                  id="default-search"
                  name="default-search"
                  className="form-control"
                  defaultValue={preferences.behaviour?.search?.defaultSearch}
                  placeholder={t('save files to')}
                />
              </InputGroup>
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
              <InputGroup>
                <FormControl
                  type="number"
                  id="search-limit"
                  name="search-limit"
                  min="1"
                  max={Infinity}
                  defaultValue={preferences.behaviour?.search?.limit}
                  placeholder={t('limits the pulled items')}
                />
              </InputGroup>
            </InputPairContainer>
            <InputPairContainer>
              <StyledLabel htmlFor="filter-search">
                {t('filter for a specific type of item')}
              </StyledLabel>
              <StyledSelect
                id="filter-search"
                className="form-select"
                defaultValue={preferences?.behaviour?.search?.type}
              >
                {['video', 'playlist'].map((options, index) => (
                  <option key={index} value={options}>
                    {options}
                  </option>
                ))}

                {/*
              <option>highest</option>
              <option>highestvideo</option>
              <option defaultValue={'selected'}>highestaudio</option>
              <option>lowest</option>
              <option>lowestvideo</option>
              <option>lowestaudio</option>
            */}
              </StyledSelect>
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
