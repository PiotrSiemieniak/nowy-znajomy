import Ably from "ably";

// ensure Vercel doesn't cache the result of this route,
// as otherwise the token request data will eventually become outdated
// and we won't be able to authenticate on the client side
export const revalidate = 0;
const KEY = process.env.ABLY_API_KEY

export async function GET(request) {
  if (!KEY) throw new Error("ABLY_API_KEY is not set");
  
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");
  if (!clientId) return null

  const client = new Ably.Rest(KEY);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId,
  });

  return Response.json(tokenRequestData);
}