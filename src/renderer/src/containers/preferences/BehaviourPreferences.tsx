import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { preferencesState } from '@states/atoms';
import languages from '@translation/languages.json';

import {
  StyledForm,
  StyledLabel,
  StyledDFieldset,
  StyledButton,
  FormControl,
  InputGroup,
  InputPairContainer,
  StyledSelect,
} from '@renderer/components/Form/Form';

const BehaviourPreferences = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const handleChangeLanguage = async (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target;
    try {
      const newPreferences = { ...preferences, behaviour: { language: value } };
      i18n.changeLanguage(value);
      window.preferences.savePreferences(newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error(error);
    }
  };
  console.log('i18n', i18n);
  console.log('preferences', preferences);
  console.log('languages', languages);
  const supportedLangs = languages.filter((language) => {
    const { supportedLngs } = i18n.options;
    return supportedLngs && Array.isArray(supportedLngs) && supportedLngs.includes(language.code);
  });
  return (
    <>
      <StyledForm
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
              <input type="checkbox" id="auto-update"></input>
              <StyledLabel htmlFor="auto-update">{t('check for updates')}</StyledLabel>
            </InputPairContainer>
          </div>
        </StyledDFieldset>
      </StyledForm>
    </>
  );
};

export default BehaviourPreferences;
