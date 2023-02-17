export const toNumber = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') throw new Error('Invalid value');

  const num = Number(value);
  if (Number.isNaN(num)) throw new Error('Invalid value');
  return num;
};