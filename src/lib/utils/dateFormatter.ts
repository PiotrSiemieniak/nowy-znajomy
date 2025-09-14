/**
 * Formatuje datę w formacie YYYY-MM na czytelny format z nazwą miesiąca
 * @param dateString - Data w formacie "YYYY-MM" 
 * @param locale - Kod języka (np. "pl", "en")
 * @returns Sformatowana data (np. "1997 lipiec", "1997 July")
 */
export function formatMonthYear(dateString: string | undefined | null, locale: string = "pl"): string {
  if (!dateString) return "";
  
  const [year, month] = dateString.split("-");
  if (!year || !month) return dateString;

  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  
  const monthName = date.toLocaleDateString(locale, { month: "long" });
  
  return `${year} ${monthName}`;
}

/**
 * Parsuje czytelny format daty na YYYY-MM
 * @param formattedDate - Data w formacie "1997 lipiec"
 * @param locale - Kod języka
 * @returns Data w formacie "YYYY-MM" lub empty string
 */
export function parseMonthYear(formattedDate: string, locale: string = "pl"): string {
  if (!formattedDate.trim()) return "";
  
  const parts = formattedDate.trim().split(" ");
  if (parts.length !== 2) return "";
  
  const [year, monthName] = parts;
  
  // Znajdź numer miesiąca na podstawie nazwy
  for (let i = 0; i < 12; i++) {
    const date = new Date(2000, i, 1);
    const name = date.toLocaleDateString(locale, { month: "long" });
    if (name.toLowerCase() === monthName.toLowerCase()) {
      const monthNumber = (i + 1).toString().padStart(2, "0");
      return `${year}-${monthNumber}`;
    }
  }
  
  return "";
}
