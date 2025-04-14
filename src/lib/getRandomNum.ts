export function getRandomNum(min: number, max: number): number {
  if (min > max) {
    throw new Error("Minimalna wartość nie może być większa niż maksymalna.");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}