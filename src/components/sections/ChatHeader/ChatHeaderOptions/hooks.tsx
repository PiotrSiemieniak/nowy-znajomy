import { useEffect } from "react";

export function useSendDisconnectOnUnload(sendDisconnect: () => void) {
  useEffect(() => {
    const handleUnload = () => {
      sendDisconnect();
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [sendDisconnect]);
}
