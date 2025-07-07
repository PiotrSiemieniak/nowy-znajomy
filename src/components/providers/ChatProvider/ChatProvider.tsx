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
  MessageState,
  SelectedChannel,
} from "./types";
import { mockRegions } from "./mocks";
import {
  DEFAULT_CHANNELS_LIST_DATA,
  DEFAULT_FILTERS,
  DEFAULT_SELECTED_CHANNELS,
} from "./consts";
import { AblyRoomProvider } from "../AblyRoomProvider";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type ChatStateType = {
  chatId: string | null;
  chatStage: ChatStage;
  isChatActive: boolean;
  bgColors: string[] | null;
  messages: MessageState[];
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
  setNewBgColors: (bgArray?: string[]) => void;
  handlePopoverOpen: (condition: boolean) => void;
  toggleChannelAsSelected: (channel: SelectedChannel) => void;
  updateFilters: (newValue: Partial<Filters>) => void; // Dodano updateFilters
  changeChatId: (value: string | null) => void;
  sendMessage: (msg: Omit<MessageState, "id">) => void;
  disconnect: (message: Omit<MessageState, "id">) => void;
};

export const ChatActionCtx = createContext<AdsListActionType | undefined>(
  undefined
);
// KARRAMBA
// 1.W ABLYROOMPROVIDER TRZEBA ZROBIĆ KOLEJNY PROVIDER
// 2. TEN PROVIDER/KOMPONENT POWINIEN WZYWAĆ AKCJE I STAN Z TEGO PROVIDERA
// 3. POWINIEN UŻYWAĆ AKCJE DO SWOICH WYDARZEŃ
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [bgColors, setBgColors] = useState<string[] | null>(null);
  const [chatStage, setChatStage] = useState<ChatStage>(ChatStage.Initial);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageState[]>([]);
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [channelsListData, setChannelsListData] = useState<ChannelsListData>(
    DEFAULT_CHANNELS_LIST_DATA
  ); // TEMP, TODO: remove when real data is available
  const [selectedChannels, setSelectedChannels] = useState<SelectedChannel[]>(
    DEFAULT_SELECTED_CHANNELS
  ); // TEMP, TODO: remove when real data is available
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const isChatActive = chatStage === ChatStage.Connected;

  // const { presence } = usePresence();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function setNewBgColors(bgArray?: string[]) {
    if (bgArray) setBgColors(bgArray);
    else setBgColors(generateColorPalette(15));
  }

  const changeChatState = (stage: ChatStage) => setChatStage(stage);
  const changeChatId = (value: string | null) => setChatId(value);

  // ==========
  // CHANNELS
  // ==========

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

  const disconnect = (el: Omit<MessageState, "id">) => {
    const isMsgNonDisconnectType = el.headers.type !== "disconnect";
    const isDisconnected = chatStage === ChatStage.Disconnected;

    if (isMsgNonDisconnectType || isDisconnected) return null;

    const newMessage: MessageState = { ...el, id: String(messages.length + 1) };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setChatStage(ChatStage.Disconnected);
  };

  const sendMessage = async (el: Omit<MessageState, "id">) => {
    const isMessageType = el.headers.type === "message";

    if (!isMessageType || !isChatActive) return null;

    const newMessage: MessageState = { ...el, id: String(messages.length + 1) };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    return;
  };

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

  // ==========
  // useFX
  // ==========

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(searchParams?.toString() || "");
    if (chatId) {
      params.set("id", chatId);
    } else {
      params.delete("id");
    }
    const newUrl = `${pathname}${params.toString() ? `?${params}` : ""}`;
    router.replace(newUrl);
  }, [chatId, pathname, searchParams, router]);

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
            sendMessage,
            disconnect,
          }}
        >
          <AblyRoomProvider chatId={chatId}>{children}</AblyRoomProvider>
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
