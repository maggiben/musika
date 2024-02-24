import * as ytdl from 'ytdl-core';
import * as utils from '@shared/utils';

export interface IOutputVideoMeta {
  label: string;
  path: string;
  requires?: string | boolean | ((value: unknown) => boolean);
  transformValue?: (number: number) => string;
}

class Info {
  protected videoInfo?: ytdl.videoInfo;

  public async run(): Promise<ytdl.videoInfo | string> {
    try {
      this.videoInfo = await this.getVideoInfo();
      if (this.videoInfo) {
        this.showVideoInfo();
      }
      return this.videoInfo;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  /**
   * Prepares video metadata information.
   *
   * @returns {IOutputVideoMeta[]} a collection of labels and values to print
   */
  private prepareVideoMetaBatch(): IOutputVideoMeta[] {
    return [
      {
        label: 'title',
        path: 'title',
      },
      {
        label: 'author',
        path: 'author.name',
      },
      {
        label: 'avg rating',
        path: 'averageRating',
      },
      {
        label: 'views',
        path: 'viewCount',
      },
      {
        label: 'publish date',
        path: 'publishDate',
      },
      {
        label: 'length',
        path: 'lengthSeconds',
        requires: utils
          .getValueFrom<ytdl.videoFormat[]>(this.videoInfo, 'formats')
          .some((format) => format.isLive),
        transformValue: utils.toHumanTime,
      },
    ];
  }

  /**
   * Print stilized output
   *
   * @param {string} label the label for the value
   * @param {string} value the value to print
   */
  private logStyledProp(label: string, value: string): void {
    // this.ux.log(`${this.ux.chalk.bold.gray(label)}: ${value}`);
    console.log('label', label, 'value', value);
  }

  /**
   * Prints video metadata information.
   *
   * @returns {void}
   */
  private printVideoMeta(): void {
    this.prepareVideoMetaBatch().forEach((outputVideoMeta: IOutputVideoMeta) => {
      const { label } = outputVideoMeta;
      const value = utils.getValueFrom<string>(
        this.videoInfo,
        `videoDetails.${outputVideoMeta.path}`,
        '',
      );
      if (!outputVideoMeta.requires) {
        if (outputVideoMeta.transformValue) {
          return this.logStyledProp(label, outputVideoMeta.transformValue(parseInt(value, 10)));
        }
        return this.logStyledProp(label, value);
      }
    });
  }

  /**
   * Prepares table rows.
   *
   * @returns {AnyJson}
   */
  private prepareTableRows(): AnyJson {
    return utils.getValueFrom<ytdl.videoFormat[]>(this.videoInfo, 'formats').map((format) => ({
      itag: utils.getValueFrom<string>(format, 'itag', ''),
      container: utils.getValueFrom<string>(format, 'container', ''),
      quality: utils.getValueFrom<string>(format, 'qualityLabel', ''),
      codecs: this.getCodec(format),
      /* istanbul ignore else */
      bitrate: utils.getValueFromMeta(
        format,
        'bitrate',
        format.qualityLabel,
        '',
        utils.toHumanSize,
      ),
      'audio bitrate': utils.getValueFromMeta(
        format,
        'audioBitrate',
        format.audioBitrate,
        '',
        utils.toHumanSize,
      ),
      size: utils.getValueFromMeta(
        format,
        'contentLength',
        format.contentLength,
        '',
        utils.toHumanSize,
      ),
    }));
  }

  private getCodec(format: ytdl.videoFormat): string {
    return utils.getValueFrom<string>(format, 'codecs', '');
  }

  /**
   * Prints video format information.
   *
   * @param {Object} videoInfo the video info object
   * @returns {Promise<void>}
   */
  private printVideoFormats(): void {
    const headers = ['itag', 'container', 'quality', 'codecs', 'bitrate', 'audio bitrate', 'size'];
    this.ux.table(this.prepareTableRows(), headers);
  }

  /**
   * Prints basic video information.
   *
   * @param {Object} videoInfo the video info object
   * @returns {Promise<void>}
   */
  private showVideoInfo(): void {
    if (this.flags.formats) {
      this.printVideoFormats();
    } else {
      this.printVideoMeta();
    }
  }

  /**
   * Gets info from a video additional formats and deciphered URLs.
   *
   * @returns {Promise<ytdl.videoInfo | undefined>} the video info object or undefined if it fails
   */
  private async getVideoInfo(): Promise<ytdl.videoInfo> {
    try {
      return await ytdl.getInfo(this.getFlag<string>('url'));
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
