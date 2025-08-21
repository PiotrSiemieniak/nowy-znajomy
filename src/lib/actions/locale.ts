'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setLocale(locale: string) {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  console.log('Setting locale to:', locale);
  
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
  
  // Get current path from referer header to redirect back to the same page
  const referer = headersList.get('referer');
  const currentPath = referer ? new URL(referer).pathname : '/';
  
  console.log('Redirecting back to:', currentPath);
  
  // Redirect to current path instead of root
  redirect(currentPath);
}
