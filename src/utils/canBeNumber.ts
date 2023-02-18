export function canBeANumber(
  value: string,
  convert: boolean = false
): boolean | number | string {
  const can =
    !isNaN(Number(value)) && !value.startsWith('0x') && value.length > 0;
  if (can && convert) {
    return Number(value);
  } else if (!can && convert) {
    return value;
  }
  return can;
}
