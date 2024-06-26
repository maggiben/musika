import { useRecoilValue } from 'recoil';
import { preferencesState } from '@states/atoms';
import { useTranslation } from 'react-i18next';
import { BsFillFolderFill } from 'react-icons/bs';
import {
  ToggleSwitch,
  DarwinRadio,
  StyledLabel,
  StyledFieldset,
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
    <StyledFieldset disabled={!preferences?.transcoding.enabled}>
      <legend style={{ display: 'flex' }}>
        <input
          type="checkbox"
          id="transcoding.enabled"
          name="transcoding.enabled"
          defaultChecked={preferences?.transcoding.enabled}
          onChange={() => {}}
        ></input>
        <SpaceRight size="xs" />
        <label htmlFor="transcoding.enabled">{t('enable live transcoding')}</label>
      </legend>
      <div>
        <InputPairContainer>
          <StyledLabel>{t('media content type')}</StyledLabel>
          <InputGroup>
            <StyledLabel htmlFor="output-filters-audio">
              <DarwinRadio
                id="output-filters-audio"
                name="output-filters"
                disabled
                defaultChecked={['audio', 'audioonly'].includes(preferences?.downloads.filter)}
              />
              <SpaceRight size="s" />
              {t('audio')}
            </StyledLabel>
            <StyledLabel htmlFor="output-filters-video">
              <DarwinRadio
                id="output-filters-video"
                name="output-filters"
                disabled
                defaultChecked={['video', 'videoonly'].includes(preferences?.downloads.filter)}
              />
              <SpaceRight size="s" />
              {t('video')}
            </StyledLabel>
            <StyledLabel htmlFor="output-filters-both">
              <DarwinRadio
                id="output-filters-both"
                name="output-filters"
                disabled
                defaultChecked={['audioandvideo', 'videoandaudio'].includes(
                  preferences?.downloads.filter,
                )}
              />
              <SpaceRight size="s" />
              {t('both')}
            </StyledLabel>
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.replace">{t('keep original copy')}</StyledLabel>
          <ToggleSwitch
            id="transcoding.replace"
            name="transcoding.replace"
            defaultChecked={!preferences.transcoding.replace}
          />
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.videoCodec">{t('video codec')}</StyledLabel>
          <InputGroup>
            <DarwinSelect
              id="transcoding.options.videoCodec"
              name="transcoding.options.videoCodec"
              defaultValue={preferences?.transcoding.options.videoCodec}
              disabled={
                !['video', 'videoonly', 'audioandvideo', 'videoandaudio'].includes(
                  preferences?.downloads.filter,
                )
              }
              style={{ flexBasis: '100%' }}
            >
              <option value="">{t('use default')}</option>
              {Object.entries(preferences.transcoding.codecs)
                .filter(([, { type, canEncode }]) => type === 'video' && canEncode)
                .map(([key, value], index) => (
                  <option key={index} value={key}>
                    {value.description}
                  </option>
                ))}
            </DarwinSelect>
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.audioCodec">{t('audio codec')}</StyledLabel>
          <InputGroup>
            <DarwinSelect
              id="transcoding.options.audioCodec"
              name="transcoding.options.audioCodec"
              defaultValue={preferences?.transcoding.options.audioCodec}
              disabled={
                !['audio', 'audioonly', 'audioandvideo', 'videoandaudio'].includes(
                  preferences?.downloads.filter,
                )
              }
              style={{ flexBasis: '100%' }}
            >
              <option value="">{t('use default')}</option>
              {Object.entries(preferences.transcoding.codecs)
                .filter(([, { type, canEncode }]) => type === 'audio' && canEncode)
                .map(([key, value], index) => (
                  <option key={index} value={key}>
                    {value.description}
                  </option>
                ))}
            </DarwinSelect>
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.format">{t('file format')}</StyledLabel>
          <InputGroup>
            <DarwinSelect
              id="transcoding.options.format"
              name="transcoding.options.format"
              defaultValue={preferences?.transcoding.options.format}
              style={{ flexBasis: '100%' }}
            >
              <option value="">{t('use default')}</option>
              {Object.entries(preferences.transcoding.formats).map(([key, value], index) => (
                <option key={index} value={key}>
                  {value.description}
                </option>
              ))}
            </DarwinSelect>
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.size">{t('video resolution')}</StyledLabel>
          <InputGroup>
            <DarwinSelect
              id="transcoding.options.size"
              name="transcoding.options.size"
              defaultValue={preferences?.transcoding.options.size}
              disabled={
                !['video', 'videoonly', 'audioandvideo', 'videoandaudio'].includes(
                  preferences?.downloads.filter,
                )
              }
              style={{ flexBasis: '100%' }}
            >
              <option value="">{t('use default')}</option>
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
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.videoBitrate">{t('video bitrate')}</StyledLabel>
          <InputGroup>
            <DarwinSelect
              id="transcoding.options.videoBitrate"
              name="transcoding.options.videoBitrate"
              defaultValue={preferences?.transcoding.options.videoBitrate}
              disabled={
                !['video', 'videoonly', 'audioandvideo', 'videoandaudio'].includes(
                  preferences?.downloads.filter,
                )
              }
              style={{ flexBasis: '100%' }}
            >
              <option value="">{t('use default')}</option>
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
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.audioBitrate">{t('audio bitrate')}</StyledLabel>
          <InputGroup>
            <DarwinSelect
              id="transcoding.options.audioBitrate"
              name="transcoding.options.audioBitrate"
              defaultValue={preferences?.transcoding.options.audioBitrate}
              disabled={
                !['audio', 'audioonly', 'audioandvideo', 'videoandaudio'].includes(
                  preferences?.downloads.filter,
                )
              }
              style={{ flexBasis: '100%' }}
            >
              <option value="">{t('use default')}</option>
              {['32', '64', '96', '128', '192', '256', '320'].map((bitrate, index) => (
                <option key={index} value={bitrate}>
                  {bitrate}Kbs
                </option>
              ))}
            </DarwinSelect>
          </InputGroup>
        </InputPairContainer>
        <InputPairContainer>
          <StyledLabel htmlFor="transcoding.options.audioFrequency">
            {t('audio frequency')}
          </StyledLabel>
          <InputGroup>
            <DarwinSelect
              id="transcoding.options.audioFrequency"
              name="transcoding.options.audioFrequency"
              defaultValue={preferences?.transcoding.options.audioFrequency}
              disabled={
                !['audio', 'audioonly', 'audioandvideo', 'videoandaudio'].includes(
                  preferences?.downloads.filter,
                )
              }
              style={{ flexBasis: '100%' }}
            >
              <option value="">{t('use default')}</option>
              {['8000', '16000', '22050', '44100', '48000', '96000', '192000'].map(
                (bitrate, index) => (
                  <option key={index} value={bitrate}>
                    {bitrate}Hz
                  </option>
                ),
              )}
            </DarwinSelect>
          </InputGroup>
        </InputPairContainer>
      </div>
    </StyledFieldset>
  );
};

const FfmpegBinaryOptions = (): JSX.Element => {
  const { t } = useTranslation();
  const preferences = useRecoilValue(preferencesState);
  const openFileDialog = async (): Promise<void> => {
    const result = await window.commands.showOpenDialog({
      defaultPath: preferences?.transcoding?.ffmpegPath,
      properties: ['openFile'],
    });
    if (!result.canceled) {
      const savePath = result.filePaths[0];
      console.log('savePath', savePath);
    }
  };

  return (
    <StyledFieldset>
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
    </StyledFieldset>
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
