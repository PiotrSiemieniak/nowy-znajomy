import * as Ably from "ably";

const ablyRest = new Ably.Rest(process.env.ABLY_API_KEY!);

export async function getAblyToken(sessionKey: string) {
  return new Promise<string>((resolve, reject) => {
    ablyRest.auth.createTokenRequest({ clientId: sessionKey }, (err, tokenRequest) => {
      if (err) return reject(err);
      resolve(tokenRequest);
    });
  });
}