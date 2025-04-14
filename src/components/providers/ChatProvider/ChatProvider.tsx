"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { generateColorPalette } from "./utils";

type ChatStateType = {
  chatId: string | null;
  isChatActive: boolean;
  bgColors: string[] | null;
};

const DEFAULT_CHAT_STATE_VALUES: ChatStateType = {
  chatId: null,
  bgColors: null,
  isChatActive: false,
};

export const ChatStateCtx = createContext<ChatStateType>(
  DEFAULT_CHAT_STATE_VALUES
);

type AdsListActionType = {
  setNewBgColors: () => void;
};

export const ChatActionCtx = createContext<AdsListActionType | undefined>(
  undefined
);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [bgColors, setBgColors] = useState<string[] | null>(null);
  const [isChatActive, setChatActive] = useState<boolean>(true); // TEMP, originally set to false
  const chatId = null; // TEMP, TODO

  function setNewBgColors() {
    setBgColors(generateColorPalette(15));
  }

  const handleEmptyBgColors = () => {
    if (bgColors === null) setNewBgColors();
  };

  useEffect(handleEmptyBgColors, [bgColors]);

  return (
    <ChatStateCtx.Provider
      value={{
        isChatActive,
        bgColors,
        chatId,
      }}
    >
      <ChatActionCtx.Provider
        value={{
          setNewBgColors,
        }}
      >
        {children}
      </ChatActionCtx.Provider>
    </ChatStateCtx.Provider>
  );
};

export const useChatAction = () => {
  const ctx = useContext(ChatActionCtx);

  if (!ctx) {
    throw new Error("useAdsListAction must be used within an AdsListProvider");
  }
  return ctx;
};

export const useChatState = () => {
  const ctx = useContext(ChatStateCtx);

  if (!ctx) {
    throw new Error("useAdsListState must be used within an AdsListProvider");
  }
  return ctx;
};
