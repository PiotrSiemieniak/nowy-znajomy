import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/configs/authConfig';
import { checkLimiter } from '@/lib/services/checkLimiter';
import { updateAccountDetailsField, getAccountDetails } from '@/lib/services/queries/accountDetails';
import type { AccountDetails } from '@/lib/globalTypes/accountDetails';
import { accountDetailsDataCardsConfig, MIN_AGE } from '@/configs/accountDetails';
import { MAX_AGE } from '@/configs/filters';

// Walidacja wartości pola na podstawie konfiguracji
function validateFieldValue(field: keyof Omit<AccountDetails, 'accountId'>, value: unknown): string | null {
  // Jeśli wartość to null, pozwalamy na usunięcie pola
  if (value === null) return null;

  const config = accountDetailsDataCardsConfig[field];
  if (!config) return `Nieznane pole: ${field}`;

  switch (config.contentType) {
    case "number":
      if (typeof value !== 'number' || isNaN(value)) {
        return `Pole ${field} musi być liczbą`;
      }
      
      // Sprawdź ograniczenia min/max
      if (config.minValue !== undefined && value < config.minValue) {
        return `Pole ${field} nie może być mniejsze niż ${config.minValue}`;
      }
      if (config.maxValue !== undefined && value > config.maxValue) {
        return `Pole ${field} nie może być większe niż ${config.maxValue}`;
      }
      break;

    case "text":
      if (typeof value !== 'string') {
        return `Pole ${field} musi być tekstem`;
      }
      if (value.trim().length === 0) {
        return `Pole ${field} nie może być puste`;
      }
      break;

    case "date":
      if (typeof value !== 'string') {
        return `Pole ${field} musi być datą w formacie string`;
      }
      
      // Sprawdź format YYYY-MM
      if (!/^\d{4}-\d{2}$/.test(value)) {
        return `Pole ${field} musi być w formacie YYYY-MM`;
      }

      // Sprawdź ograniczenia wieku dla birthDate
      if (field === 'birthDate') {
        const [year, month] = value.split('-').map(Number);
        const birthDate = new Date(year, month - 1, 1);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        
        if (age < MIN_AGE) {
          return `Wiek nie może być mniejszy niż ${MIN_AGE} lat`;
        }
        if (age > MAX_AGE) {
          return `Wiek nie może być większy niż ${MAX_AGE} lat`;
        }
      }
      break;

    case "array":
      if (!Array.isArray(value)) {
        return `Pole ${field} musi być tablicą`;
      }
      // Można dodać dodatkową walidację elementów tablicy
      break;

    case "enum":
      // Walidacja enumów może być dodana w przyszłości
      break;
  }

  return null; // Brak błędów walidacji
}

// POST /api/accountDetails/setDetail
export async function POST(req: NextRequest) {
  // Rate limiting
  const limited = await checkLimiter({ req, maxRequests: 5 });
  if (limited) return limited;

  // Session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }
  const userWithId = session.user as typeof session.user & { id?: string };
  if (!userWithId?.id) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }
  const accountId = userWithId.id; // zakładamy że id == accountId

  // Parse request body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'INVALID_JSON' }, { status: 400 });
  }

  // Validate required fields
  const { field, value } = body;
  if (!field) {
    return NextResponse.json({ ok: false, error: 'MISSING_FIELD_PARAM' }, { status: 400 });
  }

  // Explicit block for accountId
  if (field === 'accountId') {
    return NextResponse.json({ ok: false, error: 'ACCOUNT_ID_NOT_EDITABLE' }, { status: 400 });
  }

  // Define allowed fields - TypeScript wymusi wszystkie klucze z AccountDetails
  type AllowedField = keyof Omit<AccountDetails, 'accountId'>;
  
  // Mapped type wymusza wszystkie klucze - jeśli brakuje klucza, TypeScript zwróci błąd
  const allowedFieldsMap: Record<AllowedField, true> = {
    birthDate: true,
    firstName: true,
    lastName: true,
    height: true,
    nationality: true,
    weight: true,
    sports: true,
    specialFeatures: true,
    musicGenres: true,
    gender: true,
  } as const;
  
  const allowedFields = Object.keys(allowedFieldsMap) as AllowedField[];
  const allowed = new Set<AllowedField>(allowedFields);

  if (!allowed.has(field as AllowedField)) {
    return NextResponse.json({ ok: false, error: 'INVALID_FIELD' }, { status: 400 });
  }

  // Sprawdź czy pole można edytować
  const config = accountDetailsDataCardsConfig[field as AllowedField];
  if (!config?.canBeEdited) {
    return NextResponse.json({ 
      ok: false, 
      error: 'FIELD_NOT_EDITABLE',
      message: 'To pole nie może być edytowane' 
    }, { status: 400 });
  }

  // Validate value (może być null/undefined dla usunięcia pola)
  if (value === undefined) {
    return NextResponse.json({ ok: false, error: 'MISSING_VALUE_PARAM' }, { status: 400 });
  }

  // Validate field-specific constraints
  const validationError = validateFieldValue(field as AllowedField, value);
  if (validationError) {
    return NextResponse.json({ ok: false, error: 'INVALID_VALUE', message: validationError }, { status: 400 });
  }

  // Sprawdź czy pole jest edytowalne i już ma wartość (fill-once logic)
  const fieldConfig = accountDetailsDataCardsConfig[field as AllowedField];
  if (fieldConfig?.canBeEdited) {
    // Pobierz obecne dane użytkownika
    const existingDetails = await getAccountDetails(accountId);
    if (existingDetails) {
      const currentValue = existingDetails[field as AllowedField];
      const hasCurrentValue = currentValue !== null && currentValue !== undefined;
      
      // Jeśli pole ma już wartość i próbujemy je edytować (nie usuwać), blokuj
      if (hasCurrentValue && value !== null) {
        return NextResponse.json({ 
          ok: false, 
          error: 'FIELD_ALREADY_SET',
          message: 'To pole można uzupełnić tylko raz. Nie można go ponownie edytować.' 
        }, { status: 400 });
      }
    }
  }

  // Update field
  try {
    const result = await updateAccountDetailsField(accountId, field as AllowedField, value);
    
    if (!result.ok) {
      return NextResponse.json({ 
        ok: false, 
        error: result.code || 'UPDATE_FAILED',
        message: result.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      ok: true, 
      message: 'Pole zostało pomyślnie zaktualizowane',
      field,
      value 
    });

  } catch (error) {
    console.error('Update account detail field error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'INTERNAL_ERROR',
      message: 'Wystąpił błąd serwera podczas aktualizacji' 
    }, { status: 500 });
  }
}
