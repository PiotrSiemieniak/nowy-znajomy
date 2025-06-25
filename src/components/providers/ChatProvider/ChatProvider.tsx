"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { generateColorPalette } from "./utils";
import {
  ChannelsListData,
  ChatStage,
  Filters,
  MessageType,
  SelectedChannel,
} from "./types";
import { mockRegions, mocksMessages } from "./mocks";
import {
  DEFAULT_CHANNELS_LIST_DATA,
  DEFAULT_FILTERS,
  DEFAULT_SELECTED_CHANNELS,
} from "./consts";
import * as Ably from "ably";
import { MAX_CHANNELS_FOR_NON_PREMIUM } from "@/configs/channels";
import { AblyProvider } from "../AblyClientProvider";
import { useMessages } from "@ably/chat/react";
import { AblyRoomProvider } from "../AblyRoomProvider";

type ChatStateType = {
  chatId: string | null;
  chatStage: ChatStage;
  isChatActive: boolean;
  bgColors: string[] | null;
  messages: MessageType[];
  isPopoverOpen: boolean;
  channelsListData: ChannelsListData;
  selectedChannels: SelectedChannel[];
  filters: Filters;
};

const DEFAULT_CHAT_STATE_VALUES: ChatStateType = {
  chatId: null,
  bgColors: null,
  isChatActive: false,
  chatStage: ChatStage.Initial,
  messages: [],
  isPopoverOpen: false,
  channelsListData: DEFAULT_CHANNELS_LIST_DATA,
  selectedChannels: DEFAULT_SELECTED_CHANNELS,
  filters: DEFAULT_FILTERS,
};

export const ChatStateCtx = createContext<ChatStateType>(
  DEFAULT_CHAT_STATE_VALUES
);

type AdsListActionType = {
  changeChatState: (stage: ChatStage) => void;
  setNewBgColors: () => void;
  handlePopoverOpen: (condition: boolean) => void;
  toggleChannelAsSelected: (channel: SelectedChannel) => void;
  updateFilters: (newValue: Partial<Filters>) => void; // Dodano updateFilters
  changeChatId: (value: string | null) => void;
  sendMessage: (text: string) => Promise<void>;
};

export const ChatActionCtx = createContext<AdsListActionType | undefined>(
  undefined
);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [bgColors, setBgColors] = useState<string[] | null>(null);
  const [chatStage, setChatStage] = useState<ChatStage>(ChatStage.Initial);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>(mocksMessages); // TEMP, TODO: remove when real data is available
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [channelsListData, setChannelsListData] = useState<ChannelsListData>(
    DEFAULT_CHANNELS_LIST_DATA
  ); // TEMP, TODO: remove when real data is available
  const [selectedChannels, setSelectedChannels] = useState<SelectedChannel[]>(
    DEFAULT_SELECTED_CHANNELS
  ); // TEMP, TODO: remove when real data is available
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const isChatActive = chatStage === ChatStage.Connected;

  function setNewBgColors() {
    setBgColors(generateColorPalette(15));
  }

  const changeChatState = (stage: ChatStage) => setChatStage(stage);
  const changeChatId = (value: string | null) => setChatId(value);

  // ---==--- CHANNELS ---==---

  const updateChannelsList = () => {
    // TODO. This function use mocked data

    setChannelsListData({
      regions: mockRegions,
      topics: mockRegions,
      group: mockRegions,
    });
  };

  const toggleChannelAsSelected = (channel: SelectedChannel) => {
    const inArrayIndex = selectedChannels.findIndex(
      (selectedChannel) => selectedChannel.id === channel.id
    );
    const isChannelSelected = inArrayIndex !== -1;

    if (isChannelSelected) {
      // Remove
      setSelectedChannels((prev) =>
        prev.filter((_, index) => index !== inArrayIndex)
      );
    } else {
      setSelectedChannels((prev) => [...prev, channel]);
    }
  };

  // ---==--- CHANNELS END ---==---

  const updateFilters = (newValue: Partial<Filters>) => {
    setFilters((prevValue) => ({
      ...prevValue,
      ...newValue, // Aktualizacja tylko zmienionych wartości
    }));
  };

  const handlePopoverOpen = (condition: boolean) => setPopoverOpen(condition);

  const handlePopoverStateEffect = () => {
    const node = document.getElementById("chat-container");
    node?.setAttribute("data-ispopoveropen", String(isPopoverOpen));
  };

  const handleEmptyBgColors = () => {
    if (bgColors === null) setNewBgColors();
  };

  // const messageHandlerHook = chatId
  //   ? useMessages({
  //       listener: (payload) => {
  //         const newMessage = payload.message;
  //         setMessages((prevMessages) => ({ ...prevMessages, newMessage }));
  //       },
  //     })
  //   : { send: null };

  useEffect(handleEmptyBgColors, [bgColors]);
  useEffect(handlePopoverStateEffect, [isPopoverOpen]);
  useEffect(() => {
    // Wywołaj funkcję na początku
    updateChannelsList();

    // Ustaw interwał, aby wywoływać funkcję co 2 minuty (120000 ms)
    const interval = setInterval(() => {
      updateChannelsList();
    }, 120000);

    // Wyczyść interwał przy odmontowaniu komponentu
    return () => clearInterval(interval);
  }, []);

  return (
    <AblyRoomProvider chatId={chatId}>
      <ChatStateCtx.Provider
        value={{
          chatStage,
          isChatActive,
          bgColors,
          chatId,
          messages,
          isPopoverOpen,
          channelsListData,
          selectedChannels,
          filters,
        }}
      >
        <ChatActionCtx.Provider
          value={{
            setNewBgColors,
            handlePopoverOpen,
            toggleChannelAsSelected,
            updateFilters,
            changeChatState,
            changeChatId,
          }}
        >
          {children}
        </ChatActionCtx.Provider>
      </ChatStateCtx.Provider>
    </AblyRoomProvider>
  );
};

export const useChatAction = () => {
  const ctx = useContext(ChatActionCtx);

  if (!ctx) {
    throw new Error("useChatAction must be used within a ChatProvider");
  }
  return ctx;
};

export const useChatState = () => {
  const ctx = useContext(ChatStateCtx);

  if (!ctx) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return ctx;
};
