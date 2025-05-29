"use client";
import {
  SessionProvider as OriginSessionProvider,
  SessionProviderProps,
} from "next-auth/react";

export default function SessionProvider(props: SessionProviderProps) {
  return <OriginSessionProvider {...props} />;
}
