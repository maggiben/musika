import fs from 'node:fs/promises';

export const isValidUrl = (url: string): boolean => {
  try {
    const result = new URL(url);
    if (result) return true;
    throw new Error('Not a valid Url');
  } catch (error) {
    return false;
  }
};

const checkPath = async (pathOrUrl: string, mode = fs.constants.F_OK): Promise<boolean> => {
  if (typeof pathOrUrl !== 'string') {
    return false;
  }

  try {
    if (isValidUrl(pathOrUrl)) {
      return false;
    } else {
      await fs.access(pathOrUrl, mode);
      return true;
    }
  } catch (error) {
    return false;
  }
};

export default checkPath;
