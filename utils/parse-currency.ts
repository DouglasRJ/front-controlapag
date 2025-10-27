export function parseCurrency(
  formattedValue: string | undefined | null
): number | undefined {
  if (!formattedValue) {
    return undefined;
  }
  try {
    const numericString = formattedValue
      .replace(/R\$\s?/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const numberValue = parseFloat(numericString);
    return isNaN(numberValue) ? undefined : numberValue;
  } catch (error) {
    console.error("Error parsing currency:", formattedValue, error);
    return undefined;
  }
}
