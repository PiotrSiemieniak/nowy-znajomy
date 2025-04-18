"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { generateColorPalette } from "./utils";
import { MessageType } from "./types";
import { mocksMessages } from "./mocks";

type ChatStateType = {
  chatId: string | null;
  isChatActive: boolean;
  bgColors: string[] | null;
  messages: MessageType[];
  isPopoverOpen: boolean;
};

const DEFAULT_CHAT_STATE_VALUES: ChatStateType = {
  chatId: null,
  bgColors: null,
  isChatActive: false,
  messages: [],
  isPopoverOpen: false,
};

export const ChatStateCtx = createContext<ChatStateType>(
  DEFAULT_CHAT_STATE_VALUES
);

type AdsListActionType = {
  setNewBgColors: () => void;
  handlePopoverOpen: (condition: boolean) => void;
};

export const ChatActionCtx = createContext<AdsListActionType | undefined>(
  undefined
);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [bgColors, setBgColors] = useState<string[] | null>(null);
  const [isChatActive, setChatActive] = useState<boolean>(true); // TEMP, originally set to false
  const [messages, setMessages] = useState<MessageType[]>(mocksMessages); // TEMP, TODO: remove when real data is available
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);
  const chatId = null; // TEMP, TODO

  function setNewBgColors() {
    setBgColors(generateColorPalette(15));
  }

  const handlePopoverOpen = (condition: boolean) => setPopoverOpen(condition);

  const handlePopoverStateEffect = () => {
    const node = document.getElementById("chat-container");
    node?.setAttribute("data-ispopoveropen", String(isPopoverOpen));
  };

  const handleEmptyBgColors = () => {
    if (bgColors === null) setNewBgColors();
  };

  useEffect(handleEmptyBgColors, [bgColors]);
  useEffect(handlePopoverStateEffect, [isPopoverOpen]);

  return (
    <ChatStateCtx.Provider
      value={{
        isChatActive,
        bgColors,
        chatId,
        messages,
        isPopoverOpen,
      }}
    >
      <ChatActionCtx.Provider
        value={{
          setNewBgColors,
          handlePopoverOpen,
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
