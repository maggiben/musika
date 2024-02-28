import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { preferencesState } from '@states/atoms';
// import { useTranslation } from 'react-i18next';
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

const DownloadOptions = (): JSX.Element => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const openFolderDialog = async (): Promise<void> => {
    const result = await window.commands.dialogs({
      defaultPath: preferences?.downloads?.savePath,
      properties: ['openDirectory', 'promptToCreate'],
    });
    if (!result.canceled) {
      const savePath = result.filePaths[0];
      !result.canceled && setPreferences({ ...preferences, downloads: { savePath } });
    }
  };
  return (
    <StyledDFieldset>
      <legend>{t('downloads')}</legend>
      <div>
        <InputPairContainer>
          <StyledLabel htmlFor="savePath">{t('save files to')}</StyledLabel>
          <InputGroup>
            <FormControl
              type="text"
              id="savePath"
              name="savePath"
              className="form-control"
              defaultValue={preferences?.downloads?.savePath}
              placeholder={t('save files to')}
            />
            <StyledButton type="button" id="button" onClick={openFolderDialog}>
              {t('open folder')}
            </StyledButton>
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="fileNameTmpl">{t('file name template')}</StyledLabel>
          <InputGroup>
            <FormControl
              type="text"
              id="fileNameTmpl"
              name="fileNameTmpl"
              defaultValue={preferences?.downloads?.fileNameTmpl}
              placeholder={t('file name template')}
            />
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="maxconnections">{t('max connections')}</StyledLabel>
          <InputGroup>
            <FormControl
              type="number"
              id="maxconnections"
              name="maxconnections"
              min="1"
              max="100"
              className="form-control"
              defaultValue={preferences?.downloads?.maxconnections}
              placeholder={t('max connections')}
            />
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="retries">{t('retries')}</StyledLabel>
          <InputGroup>
            <FormControl
              type="number"
              id="retries"
              name="retries"
              min="1"
              max="100"
              className="form-control"
              defaultValue={preferences?.downloads?.retries}
              placeholder={t('retries')}
            />
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="timeout">{t('timeout')}</StyledLabel>
          <InputGroup>
            <FormControl
              type="number"
              id="timeout"
              name="timeout"
              min="10000"
              max="600000"
              className="form-control"
              defaultValue={preferences?.downloads?.timeout}
              placeholder={t('timeout')}
            />
          </InputGroup>
        </InputPairContainer>
      </div>
    </StyledDFieldset>
  );
};

const QualityOptions = (): JSX.Element => {
  const { t } = useTranslation();
  const [preferences] = useRecoilState(preferencesState);

  return (
    <StyledDFieldset>
      <legend>{t('media format')}</legend>
      <div>
        <InputPairContainer>
          <StyledLabel htmlFor="quality">{t('quality')}</StyledLabel>
          <StyledSelect className="form-select" defaultValue={preferences?.downloads?.quality}>
            {[
              'highest',
              'lowest',
              'highestaudio',
              'lowestaudio',
              'highestvideo',
              'lowestvideo',
            ].map((options, index) => (
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
        <InputPairContainer>
          <StyledLabel htmlFor="filter">{t('filter')}</StyledLabel>
          <StyledSelect className="form-select" defaultValue={preferences?.downloads?.filter}>
            {!preferences?.downloads?.filter && <option value=""></option>}
            {['audioandvideo', 'videoandaudio', 'video', 'videoonly', 'audio', 'audioonly'].map(
              (options, index) => (
                <option key={index} value={options}>
                  {options}
                </option>
              ),
            )}
          </StyledSelect>
        </InputPairContainer>
      </div>
    </StyledDFieldset>
  );
};

const DownloadPreferences = (): JSX.Element => {
  return (
    <>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <DownloadOptions />
        <QualityOptions />
      </StyledForm>
    </>
  );
};

export default DownloadPreferences;
