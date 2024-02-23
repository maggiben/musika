export const padZeroes = (number: number, maxLength: number) => {
  const numberString = number.toString();
  const numZeroes = Math.max(0, maxLength - numberString.length);
  return '0'.repeat(numZeroes) + numberString;
};
