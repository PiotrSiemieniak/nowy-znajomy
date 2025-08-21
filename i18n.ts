import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['pl', 'en'] as const;
export const defaultLocale = 'pl';
export type Locale = typeof locales[number];

export default getRequestConfig(async ({locale}) => {
  // Manually read cookies if locale is undefined
  let resolvedLocale = locale;
  
  if (!resolvedLocale) {
    try {
      const cookieStore = await cookies();
      
      // Try different cookie names
      const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value || 
                          cookieStore.get('locale')?.value ||
                          cookieStore.get('next-intl-locale')?.value;
      
      resolvedLocale = cookieLocale;
    } catch {
      // Silent fallback to default
    }
  }
  
  // Ensure we have a valid locale, fallback to default if undefined
  const validLocale = (resolvedLocale && locales.includes(resolvedLocale as Locale)) ? resolvedLocale : defaultLocale;
  
  return {
    locale: validLocale,
    messages: (await import(`./src/locales/${validLocale}.json`)).default
  };
});
