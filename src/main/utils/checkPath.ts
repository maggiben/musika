import fs from 'node:fs';

export const isValidUrl = (url: string): boolean => {
  try {
    const result = new URL(url);
    if (result) return true;
    throw new Error('Not a valid Url');
  } catch (error) {
    return false;
  }
};

const checkPath = (pathOrUrl: string, mode = fs.constants.F_OK): boolean => {
  if (typeof pathOrUrl !== 'string') {
    return false;
  }

  try {
    if (isValidUrl(pathOrUrl)) {
      return false;
    } else {
      fs.accessSync(pathOrUrl, mode);
      return true;
    }
  } catch (error) {
    return false;
  }
};

export default checkPath;
