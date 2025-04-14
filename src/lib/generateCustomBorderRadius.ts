export function generateCustomBorderRadius(): string {
  const randomPercentage = () => Math.floor(Math.random() * 95) + 5 + "%"; // Minimalna wartość to 5%

  // Generuj wartości dla górnego-lewego, górnego-prawego, dolnego-prawego, dolnego-lewego
  const topLeft = randomPercentage();
  const topRight = randomPercentage();
  const bottomRight = randomPercentage();
  const bottomLeft = randomPercentage();

  // Generuj wartości dla osi poziomej i pionowej
  const horizontal = `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
  const vertical = `${randomPercentage()} ${randomPercentage()} ${randomPercentage()} ${randomPercentage()}`;

  return `${horizontal} / ${vertical}`;
}