"use client"

import { getUUID } from "./crypto/getUUID";

const KEY_STR = "SESSION_KEY";

export function getSessionKey(){
  let sessionKey = sessionStorage.getItem(KEY_STR);

  if (!sessionKey) {
    sessionKey = getUUID();
    sessionStorage.setItem(KEY_STR, sessionKey);
  }
  
  return sessionKey
}