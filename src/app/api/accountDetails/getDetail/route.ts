import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/configs/authConfig';
import { checkLimiter } from '@/lib/services/checkLimiter';
import { getAccountDetails, getAccountDetailsField } from '@/lib/services/queries/accountDetails';
import type { AccountDetails } from '@/lib/globalTypes/accountDetails';

// GET /api/accountDetails/getDetail?field=all | birthDate | firstName | ...
export async function GET(req: NextRequest) {
  // Rate limiting
  const limited = await checkLimiter({ req, maxRequests: 10 });
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

  // Param
  const { searchParams } = new URL(req.url);
  const field = searchParams.get('field');
  if (!field) {
    return NextResponse.json({ ok: false, error: 'MISSING_FIELD_PARAM' }, { status: 400 });
  }

  if (field === 'all') {
    const details = await getAccountDetails(accountId);
    return NextResponse.json({ ok: true, data: details || null });
  }

  type AllowedField = keyof Omit<AccountDetails, 'accountId'>;
  const allowedFields = [
    'birthDate',
    'firstName',
    'lastName',
    'height',
    'nationality',
    'weight',
    'sports',
    'specialFeatures',
    'musicGenres',
    'gender',
  ] as const satisfies Readonly<AllowedField[]>;
  const allowed = new Set<AllowedField>(allowedFields);

  if (!allowed.has(field as AllowedField)) {
    return NextResponse.json({ ok: false, error: 'INVALID_FIELD' }, { status: 400 });
  }

  const key = field as AllowedField;
  const value = await getAccountDetailsField(accountId, key);
  return NextResponse.json({ ok: true, data: { [key]: value } });
}
