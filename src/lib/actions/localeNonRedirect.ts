'use server';

import { cookies } from 'next/headers';

export async function setLocaleNonRedirect(locale: string) {
  const cookieStore = await cookies();
  
  // Try different cookie names that next-intl might use
  const cookieNames = ['NEXT_LOCALE', 'locale', 'next-intl-locale', 'intl-locale'];
  
  for (const cookieName of cookieNames) {
    cookieStore.set(cookieName, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: false, // Allow client access
    });
  }
  
  return { success: true, locale };
}
