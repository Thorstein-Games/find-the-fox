export const obfuscateClue = (inputString: string) => {
  const unmaskedLength = 3;
  const length = inputString ? inputString.length : 0;

  if (!inputString || length <= unmaskedLength) {
    return inputString;
  }

  const firstThree = inputString.slice(0, unmaskedLength);
  const maskedPart = '*'.repeat(length - unmaskedLength);

  return firstThree + maskedPart;
};
