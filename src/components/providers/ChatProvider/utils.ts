import { auroraBackgroundColors } from "@/utils/auroraBackgroundColors";

type AuroraColor = keyof typeof auroraBackgroundColors;

export function generateColorPalette(gridSize: number): string[] {
  const colors = Object.keys(auroraBackgroundColors) as AuroraColor[];

  // Losuj od 1 do 3 kolorów bazowych
  const baseColors = Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => {
      return colors[Math.floor(Math.random() * colors.length)];
    }
  );

  // Funkcja pomocnicza do losowania odcieni z całej palety
  const getRandomShade = (color: AuroraColor): string => {
    const shades = Object.keys(auroraBackgroundColors[color]).map(Number);
    const randomShade = shades[Math.floor(Math.random() * shades.length)];

    return auroraBackgroundColors[color][randomShade as keyof typeof auroraBackgroundColors[AuroraColor]];
  };

  // Losuj kolory dla każdego elementu w siatce
  const palette: string[] = [];
  for (let i = 0; i < gridSize; i++) {
    const randomBaseColor =
      baseColors[Math.floor(Math.random() * baseColors.length)];
    palette.push(getRandomShade(randomBaseColor));
  }

  return palette;
}