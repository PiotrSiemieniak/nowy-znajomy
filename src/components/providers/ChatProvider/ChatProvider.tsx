"use client";

import { createContext } from "use-context-selector";
import React, { ReactNode, useContext, useState, useCallback } from "react";
import {
  ChangeTradeDataPopoverOpen,
  ChannelsListData,
  ChatStage,
  Filters,
  InitializeRoomUsersInfo,
  MessageState,
  RoomUsersInfo,
  RoomUsersDataField,
  SelectedChannel,
  TradeDataPopoverOpen,
  UpdateRoomUsersInfo,
} from "./types";
import {
  DEFAULT_CHANNELS_LIST_DATA,
  DEFAULT_FILTERS,
  DEFAULT_ROOM_USERS_INFO,
  DEFAULT_SELECTED_CHANNELS,
} from "./consts";
import { AblyRoomProvider } from "../AblyRoomProvider";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useChatHandlers } from "./hooks/useChatHandlers";
import { useChatEffects } from "./hooks/useChatEffects";
import { resolveMyValue, sendUserData } from "./helpers/tradeHelpers";

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
  roomUsersInfo: RoomUsersInfo;
  tradeDataPopoverOpen: TradeDataPopoverOpen;
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
  roomUsersInfo: DEFAULT_ROOM_USERS_INFO,
  tradeDataPopoverOpen: null,
};

export const ChatStateCtx = createContext<ChatStateType>(
  DEFAULT_CHAT_STATE_VALUES
);

type AdsListActionType = {
  changeChatState: (stage: ChatStage) => void;
  setNewBgColors: (bgArray?: string[]) => void;
  handlePopoverOpen: (condition: boolean) => void;
  toggleChannelAsSelected: (channel: SelectedChannel) => void;
  updateFilters: (newValue: Partial<Filters>) => void;
  changeChatId: (value: string | null) => void;
  sendMessage: (msg: Omit<MessageState, "id">) => void;
  sendInterlocutorDataMessage: (msg: Omit<MessageState, "id">) => void;
  disconnect: (message: Omit<MessageState, "id">) => void;
  updateRoomUsersInfo: UpdateRoomUsersInfo;
  initializeRoomUsersInfo: InitializeRoomUsersInfo;
  changeTradeDataPopoverOpen: ChangeTradeDataPopoverOpen;
  getInterlocutorData: (
    dataKey: string
  ) => RoomUsersDataField | null | undefined;
};

// Musimy stworzyć domyślne wartości dla actions też
const DEFAULT_ACTIONS: AdsListActionType = {
  changeChatState: () => {},
  setNewBgColors: () => {},
  handlePopoverOpen: () => {},
  toggleChannelAsSelected: () => {},
  updateFilters: () => {},
  changeChatId: () => {},
  sendMessage: () => {},
  disconnect: () => {},
  updateRoomUsersInfo: () => {},
  initializeRoomUsersInfo: () => {},
  changeTradeDataPopoverOpen: () => {},
  sendInterlocutorDataMessage: () => {},
  getInterlocutorData: () => null,
};

export const ChatActionCtx = createContext<AdsListActionType>(DEFAULT_ACTIONS);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("providers");
  const { status, data: session } = useSession();
  const isLoggedIn = status === "authenticated";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // === STATES ===
  const [bgColors, setBgColors] = useState<string[] | null>(null);
  const [chatStage, setChatStage] = useState<ChatStage>(ChatStage.Initial);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageState[]>([]);
  const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [tradeDataPopoverOpen, setTradeDataPopoverOpen] =
    useState<TradeDataPopoverOpen>(null);
  const [channelsListData, setChannelsListData] = useState<ChannelsListData>(
    DEFAULT_CHANNELS_LIST_DATA
  );
  const [selectedChannels, setSelectedChannels] = useState<SelectedChannel[]>(
    DEFAULT_SELECTED_CHANNELS
  );
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [roomUsersInfo, setRoomUsersInfo] = useState<RoomUsersInfo>(
    DEFAULT_ROOM_USERS_INFO
  );

  const isChatActive = chatStage === ChatStage.Connected;

  // === HELPERS ===
  const resolveMyValueCallback = useCallback(
    (dataKey: string) => resolveMyValue(dataKey, session?.user?.name),
    [session?.user?.name]
  );

  const sendUserDataCallback = useCallback(
    (dataKey: string, value: RoomUsersDataField["value"] | null | undefined) =>
      sendUserData(dataKey, value, setRoomUsersInfo),
    [setRoomUsersInfo]
  );

  const resetProvidersToDefault = useCallback(() => {
    setMessages([]);
    setChatId(null);
  }, []);

  // === CUSTOM HOOKS ===
  const handlers = useChatHandlers({
    bgColors,
    setBgColors,
    setChatStage,
    setChatId,
    messages,
    setMessages,
    setPopoverOpen,
    setTradeDataPopoverOpen,
    selectedChannels,
    setSelectedChannels,
    setFilters,
    roomUsersInfo,
    setRoomUsersInfo,
    chatStage,
    chatId,
    isChatActive,
    isLoggedIn,
    sessionUserName: session?.user?.name,
    t: t as (key: string, params?: Record<string, unknown>) => string,
  });

  useChatEffects({
    bgColors,
    setNewBgColors: handlers.setNewBgColors,
    isPopoverOpen,
    setChannelsListData,
    chatId,
    chatStage,
    pathname,
    searchParams,
    router,
    resetProvidersToDefault,
    roomUsersInfo,
    isLoggedIn,
    isChatActive,
    resolveMyValue: resolveMyValueCallback,
    sendUserData: sendUserDataCallback,
  });

  // === CONTEXT VALUES ===
  const stateValue: ChatStateType = {
    chatStage,
    isChatActive,
    bgColors,
    chatId,
    messages,
    isPopoverOpen,
    channelsListData,
    selectedChannels,
    filters,
    roomUsersInfo,
    tradeDataPopoverOpen,
  };

  const actionValue: AdsListActionType = {
    changeChatState: handlers.changeChatState,
    setNewBgColors: handlers.setNewBgColors,
    handlePopoverOpen: handlers.handlePopoverOpen,
    toggleChannelAsSelected: handlers.toggleChannelAsSelected,
    updateFilters: handlers.updateFilters,
    changeChatId: handlers.changeChatId,
    sendMessage: handlers.sendMessage,
    disconnect: handlers.disconnect,
    updateRoomUsersInfo: handlers.updateRoomUsersInfo,
    initializeRoomUsersInfo: handlers.initializeRoomUsersInfo,
    changeTradeDataPopoverOpen: handlers.changeTradeDataPopoverOpen,
    sendInterlocutorDataMessage: handlers.sendInterlocutorDataMessage,
    getInterlocutorData: handlers.getInterlocutorData,
  };

  return (
    <ChatStateCtx.Provider value={stateValue}>
      <ChatActionCtx.Provider value={actionValue}>
        <AblyRoomProvider chatId={chatId}>{children}</AblyRoomProvider>
      </ChatActionCtx.Provider>
    </ChatStateCtx.Provider>
  );
};

export const useChatAction = () => {
  // Używamy zwykłego React useContext ponieważ akcje nie potrzebują selekcji
  const ctx = useContext(ChatActionCtx as React.Context<AdsListActionType>);

  if (!ctx || ctx === DEFAULT_ACTIONS) {
    throw new Error("useChatAction must be used within a ChatProvider");
  }
  return ctx;
};

export const useChatState = () => {
  // Używamy zwykłego React useContext dla backward compatibility
  // Komponenty które chcą używać selekcji powinny używać useContextSelector bezpośrednio
  const ctx = useContext(ChatStateCtx as React.Context<ChatStateType>);

  if (!ctx) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return ctx;
};

// Export useContextSelector hook for performance-optimized components
export { useContextSelector } from "use-context-selector";
