import { useRecoilState, useRecoilValue } from 'recoil';
import { preferencesState } from '@states/atoms';
import { useTranslation } from 'react-i18next';
import { BsFillFolderFill } from 'react-icons/bs';
import {
  StyledLabel,
  StyledDFieldset,
  InputGroup,
  InputPairContainer,
  DarwinButton,
  DarwinInput,
  DarwinSelect,
} from '@components/Form/Form';
import { SpaceBottom, SpaceRight } from '@components/Spacing/Spacing';

const TranscodingOptions = (): JSX.Element => {
  const { t } = useTranslation();
  const preferences = useRecoilValue(preferencesState);

  return (
    <StyledDFieldset>
      <legend style={{ display: 'flex' }}>
        <input
          type="checkbox"
          id="transcoding.enabled"
          name="transcoding.enabled"
          defaultChecked={preferences?.transcoding.enabled}
          onChange={() => {}}
        ></input>
        <SpaceRight size="xs" />
        <label htmlFor="transcoding.enabled">{t('enable transcoding')}</label>
      </legend>
      <div>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.videoCodec">{t('video codec')}</StyledLabel>
          <DarwinSelect
            id="transcoding.options.videoCodec"
            name="transcoding.options.videoCodec"
            defaultValue={preferences?.transcoding.options.videoCodec}
            style={{ flexBasis: '100%' }}
          >
            <option>{t('keep original')}</option>
            {Object.entries(preferences.transcoding.codecs)
              .filter(([, { type, canEncode }]) => type === 'video' && canEncode)
              .map(([key, value], index) => (
                <option key={index} value={key}>
                  {value.description}
                </option>
              ))}
          </DarwinSelect>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.audioCodec">{t('audio codec')}</StyledLabel>
          <DarwinSelect
            id="transcoding.options.audioCodec"
            name="transcoding.options.audioCodec"
            defaultValue={preferences?.transcoding.options.audioCodec}
            style={{ flexBasis: '100%' }}
          >
            <option>{t('keep original')}</option>
            {Object.entries(preferences.transcoding.codecs)
              .filter(([, { type, canEncode }]) => type === 'audio' && canEncode)
              .map(([key, value], index) => (
                <option key={index} value={key}>
                  {value.description}
                </option>
              ))}
          </DarwinSelect>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.format">{t('file format')}</StyledLabel>
          <DarwinSelect
            id="transcoding.options.format"
            name="transcoding.options.format"
            defaultValue={preferences?.transcoding.options.format}
            style={{ flexBasis: '100%' }}
          >
            {Object.entries(preferences.transcoding.formats).map(([key, value], index) => (
              <option key={index} value={key}>
                {value.description}
              </option>
            ))}
          </DarwinSelect>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.videoSize">{t('video resolution')}</StyledLabel>
          <DarwinSelect
            id="transcoding.options.videoSize"
            name="transcoding.options.videoSize"
            defaultValue={preferences?.transcoding.options.videoSize}
            disabled={!preferences?.transcoding.options.videoCodec}
            style={{ flexBasis: '100%' }}
          >
            <option>{t('keep original')}</option>
            {[
              { value: '640x360', label: '360p' },
              { value: '854x480', label: '480p' },
              { value: '1280x720', label: '720p' },
              { value: '1920x1080', label: '1080p or Full HD' },
              { value: '2560x1440', label: '1440p or 2K' },
              { value: '3840x2160', label: '2160p or 4K' },
              { value: '7680x4320', label: '4320p or 8K' },
            ].map((videoSize, index) => (
              <option key={index} value={videoSize.value}>
                {videoSize.label}
              </option>
            ))}
          </DarwinSelect>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.videoBitrate">{t('video bitrate')}</StyledLabel>
          <DarwinSelect
            id="transcoding.options.videoBitrate"
            name="transcoding.options.videoBitrate"
            defaultValue={preferences?.transcoding.options.videoBitrate}
            disabled={!preferences?.transcoding.options.videoCodec}
            style={{ flexBasis: '100%' }}
          >
            <option>{t('default')}</option>
            {[
              { value: '500', label: 'Very low-quality video' },
              {
                value: '1000',
                label: 'Low-quality',
              },
              {
                value: '2000',
                label: 'Standard definition (SD)',
              },
              {
                value: '5000',
                label: 'High definition (HD) 720p',
              },
              {
                value: '8000',
                label: 'Full HD 1080p',
              },
              {
                value: '15000',
                label: '2K',
              },
              {
                value: '25000',
                label: '4K Ultra HD',
              },
            ].map((bitrate, index) => (
              <option key={index} value={bitrate.value}>
                {bitrate.value}Kbs
              </option>
            ))}
          </DarwinSelect>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.audioBitrate">{t('audio bitrate')}</StyledLabel>
          <DarwinSelect
            id="transcoding.options.audioBitrate"
            name="transcoding.options.audioBitrate"
            defaultValue={preferences?.transcoding.options.audioBitrate}
            disabled={!preferences?.transcoding.options.audioCodec}
            style={{ flexBasis: '100%' }}
          >
            <option>{t('default')}</option>
            {['32', '64', '96', '128', '192', '256', '320'].map((bitrate, index) => (
              <option key={index} value={bitrate}>
                {bitrate}Kbs
              </option>
            ))}
          </DarwinSelect>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.audioFrequency">
            {t('audio frequency')}
          </StyledLabel>
          <DarwinSelect
            id="transcoding.options.audioFrequency"
            name="transcoding.options.audioFrequency"
            defaultValue={preferences?.transcoding.options.audioFrequency}
            disabled={!preferences?.transcoding.options.audioCodec}
            style={{ flexBasis: '100%' }}
          >
            <option>{t('default')}</option>
            {[8000, 16000, 22050, 44100, 48000, 96000, 192000].map((bitrate, index) => (
              <option key={index} value={bitrate}>
                {bitrate}Hz
              </option>
            ))}
          </DarwinSelect>
        </InputPairContainer>
      </div>
    </StyledDFieldset>
  );
};

const FfmpegBinaryOptions = (): JSX.Element => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useRecoilState(preferencesState);
  const openFileDialog = async (): Promise<void> => {
    const result = await window.commands.dialogs({
      defaultPath: preferences?.transcoding?.ffmpegPath,
      properties: ['openFile'],
    });
    if (!result.canceled) {
      const savePath = result.filePaths[0];
      console.log('savePath', savePath);
    }
  };

  return (
    <StyledDFieldset>
      <legend>{t('ffmpeg')}</legend>
      <div>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.ffmpegPath">{t('ffmpeg binary path')}</StyledLabel>
          <InputGroup>
            <DarwinInput
              type="text"
              id="transcoding.ffmpegPath"
              name="transcoding.ffmpegPath"
              defaultValue={preferences?.transcoding?.ffmpegPath}
              readOnly={true}
              style={{ flex: 1 }}
            />
            <SpaceRight size="s" />
            <DarwinButton type="button" id="button" onClick={openFileDialog}>
              <BsFillFolderFill />
            </DarwinButton>
          </InputGroup>
        </InputPairContainer>
      </div>
    </StyledDFieldset>
  );
};

const TranscodingPreferences = (): JSX.Element => {
  return (
    <>
      <TranscodingOptions />
      <SpaceBottom size="s" />
      <FfmpegBinaryOptions />
    </>
  );
};

export default TranscodingPreferences;
