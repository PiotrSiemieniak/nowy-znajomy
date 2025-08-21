import {getRequestConfig} from 'next-intl/server';

export const locales = ['pl', 'en'] as const;
export const defaultLocale = 'pl';
export type Locale = typeof locales[number];

export default getRequestConfig(async ({locale}) => {
  // Use default locale if the incoming locale is invalid
  const validLocale: Locale = (locale && locales.includes(locale as Locale)) 
    ? (locale as Locale) 
    : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./src/locales/${validLocale}.json`)).default
  };
});
