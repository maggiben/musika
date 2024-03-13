import { useEffect, useRef, useLayoutEffect } from 'react';
import { useRecoilState } from 'recoil';
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
import useModalResize from '@renderer/hooks/useModalResize';

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
      console.log('savePath:', savePath);
      // setPreferences({ ...preferences, downloads: { savePath } });
      setPreferences((prev) => {
        return (
          prev &&
          structuredClone({ ...preferences, downloads: { ...preferences?.downloads, savePath } })
        );
      });
    }
  };
  console.log('savePath:', preferences?.downloads?.savePath);
  return (
    <StyledDFieldset>
      <legend>{t('downloads')}</legend>
      <div>
        <InputPairContainer>
          <StyledLabel htmlFor="savePath">{t('save files to')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="text"
              id="savePath"
              name="savePath"
              disabled={true}
              value={preferences?.downloads?.savePath}
              placeholder={t('save files to')}
              style={{ flex: 1 }}
            />
            <SpaceRight size="s" />
            <DarwinButton type="button" id="button" onClick={openFolderDialog}>
              {t('open folder')}
              <SpaceRight size="xs" />
              <BsFillFolderFill />
            </DarwinButton>
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="fileNameTmpl">{t('file name template')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="text"
              id="fileNameTmpl"
              name="fileNameTmpl"
              defaultValue={preferences?.downloads?.fileNameTmpl}
              placeholder={t('file name template')}
              style={{ flex: 1 }}
            />
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="maxconnections">{t('max connections')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="number"
              id="maxconnections"
              name="maxconnections"
              min="1"
              max="100"
              className="form-control"
              defaultValue={preferences?.downloads?.maxconnections}
              placeholder={t('max connections')}
              style={{ flex: 1 }}
            />
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="retries">{t('retries')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="number"
              id="retries"
              name="retries"
              min="1"
              max="100"
              className="form-control"
              defaultValue={preferences?.downloads?.retries}
              placeholder={t('retries')}
              style={{ flex: 1 }}
            />
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="timeout">{t('timeout')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="number"
              id="timeout"
              name="timeout"
              min="10000"
              max="600000"
              className="form-control"
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
  const [preferences] = useRecoilState(preferencesState);

  return (
    <StyledDFieldset>
      <legend>{t('media format')}</legend>
      <div>
        <InputPairContainer>
          <StyledLabel htmlFor="quality">{t('quality')}</StyledLabel>
          <DarwinSelect
            className="form-select"
            defaultValue={preferences?.downloads?.quality}
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
          <StyledLabel htmlFor="filter">{t('filter')}</StyledLabel>
          <DarwinSelect
            className="form-select"
            defaultValue={preferences?.downloads?.filter}
            style={{ flexBasis: '100%' }}
          >
            {!preferences?.downloads?.filter && <option value=""></option>}
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
  const formRef = useRef<HTMLFormElement>(null);
  useModalResize(formRef);

  return (
    <>
      <PreferencesForm
        ref={formRef}
        data-testid="download-preferences-form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <DownloadOptions />
        <SpaceBottom size="s" />
        <QualityOptions />
      </PreferencesForm>
    </>
  );
};

export default DownloadPreferences;
