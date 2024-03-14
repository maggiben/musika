import { useRecoilState, useRecoilValue } from 'recoil';
import { preferencesState } from '@states/atoms';
import { useTranslation } from 'react-i18next';
import { BsFillFolderFill } from 'react-icons/bs';
import styled from 'styled-components';
import {
  StyledForm,
  StyledLabel,
  StyledDFieldset,
  InputGroup,
  InputPairContainer,
  DarwinButton,
  DarwinInput,
  DarwinSelect,
} from '@components/Form/Form';
import { SpaceBottom, SpaceRight } from '@components/Spacing/Spacing';

export const PreferencesForm = styled(StyledForm)`
  padding: ${({ theme }) => theme.spacing.s};
`;

const DownloadOptions = (): JSX.Element => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const openFolderDialog = async (): Promise<void> => {
    const result = await window.commands.dialogs({
      defaultPath: preferences?.downloads?.savePath,
      properties: ['openDirectory', 'createDirectory'],
    });
    if (!result.canceled) {
      const savePath = result.filePaths[0];
      setPreferences({ ...preferences, downloads: { ...preferences?.downloads, savePath } });
    }
  };

  return (
    <StyledDFieldset>
      <legend>{t('downloads')}</legend>
      <div>
        <InputPairContainer>
          <StyledLabel htmlFor="downloads.savePath">{t('save files to')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="text"
              id="downloads.savePath"
              name="downloads.savePath"
              defaultValue={preferences?.downloads?.savePath}
              placeholder={t('save files to')}
              style={{ flex: 1 }}
            />
            <SpaceRight size="s" />
            <DarwinButton type="button" id="button" onClick={openFolderDialog}>
              <BsFillFolderFill />
            </DarwinButton>
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="downloads.fileNameTmpl">{t('file name template')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="text"
              id="downloads.fileNameTmpl"
              name="downloads.fileNameTmpl"
              defaultValue={preferences?.downloads?.fileNameTmpl}
              placeholder={t('file name template')}
              style={{ flex: 1 }}
            />
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="downloads.maxconnections">{t('max connections')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="number"
              id="downloads.maxconnections"
              name="downloads.maxconnections"
              min="1"
              max="100"
              defaultValue={preferences?.downloads?.maxconnections}
              placeholder={t('max connections')}
              style={{ flex: 1 }}
            />
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="downloads.retries">{t('retries')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="number"
              id="downloads.retries"
              name="downloads.retries"
              min="1"
              max="100"
              defaultValue={preferences?.downloads?.retries}
              placeholder={t('retries')}
              style={{ flex: 1 }}
            />
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="downloads.timeout">{t('timeout')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="number"
              id="downloads.timeout"
              name="downloads.timeout"
              min="10000"
              max="600000"
              defaultValue={preferences?.downloads?.timeout}
              placeholder={t('timeout')}
              style={{ flex: 1 }}
            />
          </InputGroup>
        </InputPairContainer>
      </div>
    </StyledDFieldset>
  );
};

const QualityOptions = (): JSX.Element => {
  const { t } = useTranslation();
  const preferences = useRecoilValue(preferencesState);

  return (
    <StyledDFieldset>
      <legend>{t('media format')}</legend>
      <div>
        <InputPairContainer>
          <StyledLabel htmlFor="downloads.quality">{t('quality')}</StyledLabel>
          <DarwinSelect
            id="download.quality"
            name="download.quality"
            defaultValue={preferences?.downloads.quality}
            style={{ flexBasis: '100%' }}
          >
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
          </DarwinSelect>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="downloads.filter">{t('filter')}</StyledLabel>
          <DarwinSelect
            id="downloads.filter"
            name="downloads.filter"
            defaultValue={preferences?.downloads.filter}
            style={{ flexBasis: '100%' }}
          >
            {['audioandvideo', 'videoandaudio', 'video', 'videoonly', 'audio', 'audioonly'].map(
              (options, index) => (
                <option key={index} value={options}>
                  {options}
                </option>
              ),
            )}
          </DarwinSelect>
        </InputPairContainer>
      </div>
    </StyledDFieldset>
  );
};

const DownloadPreferences = (): JSX.Element => {
  return (
    <>
      <DownloadOptions />
      <SpaceBottom size="s" />
      <QualityOptions />
    </>
  );
};

export default DownloadPreferences;
