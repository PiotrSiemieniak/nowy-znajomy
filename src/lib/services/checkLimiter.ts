import createRateLimit from 'next-rate-limit';
import { NextRequest, NextResponse } from 'next/server';

const limiter = createRateLimit({
  interval: 60 * 1000, // 1 minuta
  uniqueTokenPerInterval: 500, // max 500 różnych IP na minutę
});

type CheckLimiterOptions = {
  req: NextRequest;
  maxRequests?: number;
  errorMessage?: string;
  statusCode?: number;
};

/**
 * Sprawdza limit żądań dla danego endpointa.
 * @param options - Konfiguracja limitera
 * @returns NextResponse | void
 *
 * Przykład użycia:
 * const limiterResponse = await checkLimiter({ req, maxRequests: 5 });
 * if (limiterResponse) return limiterResponse;
 */
export async function checkLimiter({
  req,
  maxRequests = 5,
  errorMessage = 'Za dużo prób, spróbuj później.',
  statusCode = 429,
}: CheckLimiterOptions): Promise<NextResponse | void> {
  try {
    await limiter.checkNext(req, maxRequests);
  } catch {
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}