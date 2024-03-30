import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { preferencesState } from '@states/atoms';
import { BsFillFolderFill } from 'react-icons/bs';
import languages from '@locale/languages.json';
import {
  StyledLabel,
  StyledFieldset,
  InputPairContainer,
  InputGroup,
  ToggleSwitch,
  DarwinSelect,
  DarwinInput,
  DarwinButton,
} from '@renderer/components/Form/Form';
import { SpaceBottom, SpaceRight } from '@components/Spacing/Spacing';

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
      <StyledFieldset>
        <legend>{t('interface')}</legend>
        <i>{t('restart required message')}</i>
        <div>
          <InputPairContainer>
            <StyledLabel htmlFor="behaviour.language">{t('language')}</StyledLabel>
            <InputGroup>
              <DarwinSelect
                id="behaviour.language"
                name="behaviour.language"
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
            </InputGroup>
          </InputPairContainer>
        </div>
      </StyledFieldset>
      <SpaceBottom size="s" />
      <StyledFieldset>
        <legend>{t('desktop')}</legend>
        <div>
          <InputPairContainer>
            <StyledLabel htmlFor="behaviour.shouldUseDarkColors">{t('ui theme')}</StyledLabel>
            <InputGroup>
              <DarwinSelect
                id="behaviour.shouldUseDarkColors"
                name="behaviour.shouldUseDarkColors"
                defaultValue={preferences?.behaviour.shouldUseDarkColors}
                style={{ flexBasis: '100%' }}
              >
                {[
                  { label: 'System (default)', value: 'default' },
                  { label: 'light', value: 'light' },
                  { label: 'dark', value: 'dark' },
                ].map(({ label, value }, index) => (
                  <option key={index} value={value}>
                    {label}
                  </option>
                ))}
              </DarwinSelect>
            </InputGroup>
          </InputPairContainer>
          <InputPairContainer>
            <StyledLabel htmlFor="advanced.update.automatic">{t('check for updates')}</StyledLabel>
            <ToggleSwitch
              id="advanced.update.automatic"
              name="advanced.update.automatic"
              defaultChecked={preferences.advanced?.update?.automatic}
            />
          </InputPairContainer>
          <InputPairContainer>
            <StyledLabel htmlFor="behaviour.notifications.enabled">
              {t('enable notifications')}
            </StyledLabel>
            <InputGroup>
              <ToggleSwitch
                id="behaviour.notifications.enabled"
                name="behaviour.notifications.enabled"
                defaultChecked={preferences.behaviour?.notifications?.enabled}
              />
              <StyledLabel htmlFor="behaviour.notifications.silent">
                {t('silent notifications')}
              </StyledLabel>
              <ToggleSwitch
                id="behaviour.notifications.silent"
                name="behaviour.notifications.silent"
                disabled={!preferences.behaviour?.notifications?.enabled}
                defaultChecked={preferences.behaviour?.notifications?.silent}
              />
            </InputGroup>
          </InputPairContainer>
        </div>
      </StyledFieldset>
      <SpaceBottom size="s" />
      <StyledFieldset>
        <legend>{t('search options')}</legend>
        <div>
          <InputPairContainer>
            <StyledLabel htmlFor="behaviour.search.safeSearch">{t('safe search')}</StyledLabel>
            <ToggleSwitch
              id="behaviour.search.safeSearch"
              name="behaviour.search.safeSearch"
              defaultChecked={preferences.behaviour?.search?.safeSearch}
            />
          </InputPairContainer>
          <InputPairContainer>
            <StyledLabel htmlFor="behaviour.search.limit">{t('limit')}</StyledLabel>
            <InputGroup>
              <DarwinInput
                type="number"
                id="behaviour.search.limit"
                name="behaviour.search.limit"
                min="1"
                max={Infinity}
                defaultValue={preferences.behaviour?.search?.limit}
                placeholder={t('limits the pulled items')}
                style={{ flexBasis: '100%' }}
              />
            </InputGroup>
          </InputPairContainer>
          <InputPairContainer>
            <StyledLabel htmlFor="behaviour.search.type">
              {t('filter for a specific type of item')}
            </StyledLabel>
            <InputGroup>
              <DarwinSelect
                id="behaviour.search.type"
                name="behaviour.search.type"
                defaultValue={preferences?.behaviour?.search?.type}
                style={{ flexBasis: '100%' }}
              >
                {['video', 'playlist'].map((options, index) => (
                  <option key={index} value={options}>
                    {options}
                  </option>
                ))}
              </DarwinSelect>
            </InputGroup>
          </InputPairContainer>
        </div>
      </StyledFieldset>
      <SpaceBottom size="s" />
      <StyledFieldset disabled>
        <legend style={{ display: 'flex' }}>
          <input
            type="checkbox"
            id="advanced.logs.enabled"
            name="advanced.logs.enabled"
            defaultChecked={preferences?.advanced?.logs.enabled}
            onChange={() => {}}
          ></input>
          <SpaceRight size="xs" />
          <label htmlFor="advanced.logs.enabled">{t('log file')}</label>
        </legend>
        <div>
          <InputPairContainer>
            <StyledLabel htmlFor="advanced.logs.savePath">{t('save files to')}</StyledLabel>
            <InputGroup>
              <DarwinInput
                type="text"
                id="advanced.logs.savePath"
                name="advanced.logs.savePath"
                defaultValue={preferences?.advanced?.logs?.savePath}
                readOnly={true}
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
      </StyledFieldset>
    </>
  );
};

export default BehaviourPreferences;
