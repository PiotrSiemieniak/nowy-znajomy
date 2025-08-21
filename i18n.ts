import {getRequestConfig} from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['pl', 'en'] as const;
export const defaultLocale = 'pl';
export type Locale = typeof locales[number];

export default getRequestConfig(async ({locale}) => {
  // Debug: sprawdź co middleware przekazuje
  console.log('getRequestConfig received locale:', locale);
  
  // Manually read cookies if locale is undefined
  let resolvedLocale = locale;
  
  if (!resolvedLocale) {
    try {
      const cookieStore = await cookies();
      const headersList = await headers();
      
      console.log('Reading cookies manually...');
      console.log('All cookies:', cookieStore.getAll().map(c => `${c.name}=${c.value}`));
      
      // Try different cookie names
      const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value || 
                          cookieStore.get('locale')?.value ||
                          cookieStore.get('next-intl-locale')?.value;
      
      console.log('Cookie locale found:', cookieLocale);
      
      // Also check Accept-Language header as fallback
      const acceptLanguage = headersList.get('accept-language');
      console.log('Accept-Language header:', acceptLanguage);
      
      resolvedLocale = cookieLocale;
    } catch (error) {
      console.log('Error reading cookies:', error);
    }
  }
  
  // Ensure we have a valid locale, fallback to default if undefined
  const validLocale = (resolvedLocale && locales.includes(resolvedLocale as Locale)) ? resolvedLocale : defaultLocale;
  
  console.log('Final resolved locale:', validLocale);
  
  return {
    locale: validLocale,
    messages: (await import(`./src/locales/${validLocale}.json`)).default
  };
});
