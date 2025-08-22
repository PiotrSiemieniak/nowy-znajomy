"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { generateColorPalette } from "./utils";
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
import { mockRegions } from "./mocks";
import {
  DEFAULT_CHANNELS_LIST_DATA,
  DEFAULT_FILTERS,
  DEFAULT_ROOM_USERS_INFO,
  DEFAULT_SELECTED_CHANNELS,
} from "./consts";
import { AblyRoomProvider } from "../AblyRoomProvider";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { disconnectRoom } from "@/lib/services/api/room";
import { getSessionKey } from "@/lib/getSessionKey";
import {
  useDeleteRoomOnDisconnectEffect,
  useResetProviderOnSearching,
} from "./hooks";
import { throwDebugMessage } from "@/lib/services/throwDebugMessage";
import { useSession } from "next-auth/react";
import {
  getMyAccountDetailField,
  AccountDetailsFieldKey,
} from "@/lib/services/api/accountDetails";
import { useTranslations } from "next-intl";

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
  updateFilters: (newValue: Partial<Filters>) => void; // Dodano updateFilters
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

export const ChatActionCtx = createContext<AdsListActionType | undefined>(
  undefined
);
// KARRAMBA
// 1.W ABLYROOMPROVIDER TRZEBA ZROBIĆ KOLEJNY PROVIDER
// 2. TEN PROVIDER/KOMPONENT POWINIEN WZYWAĆ AKCJE I STAN Z TEGO PROVIDERA
// 3. POWINIEN UŻYWAĆ AKCJE DO SWOICH WYDARZEŃ
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations("providers");
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

  const { status, data: session } = useSession();
  const isLoggedIn = status === "authenticated";

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

    const sessionKey = getSessionKey();
    const newMessage: MessageState = { ...el, id: String(messages.length + 1) };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setChatStage(ChatStage.Disconnected);
    if (chatId) {
      disconnectRoom({
        sessionKey,
        roomId: chatId,
      });
    }
  };

  const sendMessage = async (el: Omit<MessageState, "id">) => {
    const isMessageType = el.headers.type === "message";

    if (!isMessageType || !isChatActive) {
      throwDebugMessage(t("sendMessageError"), el.headers.type);

      return;
    }

    const newMessage: MessageState = { ...el, id: String(messages.length + 1) };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    return;
  };

  const sendInterlocutorDataMessage = async (el: Omit<MessageState, "id">) => {
    const type = el.headers.type;

    if (type === "interlocutorData") {
      sendTradeOfferMessage(el);
    } else if (type === "tradeAccepted") {
      await acceptTradeOffer(el);
    }
  };

  const sendTradeOfferMessage = (el: Omit<MessageState, "id">) => {
    if (!isLoggedIn) return; // użytkownik niezalogowany – nic nie rób
    if (!isChatActive) {
      throwDebugMessage(t("sendInterlocutorDataError"));
    }

    const myId = getSessionKey();

    const newMessage: MessageState = { ...el, id: String(messages.length + 1) };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    if (el.author === myId) {
      // Jeśli to ja wysyłam wiadomość, to aktualizuj roomUsersInfo
      setRoomUsersInfo((state) => {
        const dataKey = el.headers.dataKey as string;
        const prevData = state[myId] || {};
        type Dyn = Record<string, RoomUsersDataField>;
        const prevField = (prevData as Dyn)[dataKey] || {};

        return {
          ...state,
          [myId]: {
            ...prevData,
            [dataKey]: {
              ...prevField,
              wantToShow: true,
            },
          },
        };
      });
    }
  };

  // Helper: check if interlocutor exposed a given dataKey
  const isInterlocutorWantToShow = (dataKey: string): boolean => {
    const myId = getSessionKey();
    const ids = Object.keys(roomUsersInfo || {});
    const interlocutorId = ids.find((id) => id !== myId);
    if (!interlocutorId) return false;
    const field = (
      roomUsersInfo[interlocutorId] as
        | Record<string, RoomUsersDataField>
        | undefined
    )?.[dataKey];
    return !!field?.wantToShow;
  };

  // Helper: check if I exposed a given dataKey
  const isMeWantToShow = (dataKey: string): boolean => {
    const myId = getSessionKey();
    const field = (
      roomUsersInfo[myId] as Record<string, RoomUsersDataField> | undefined
    )?.[dataKey];
    return !!field?.wantToShow;
  };

  // Helper: ensure my wantToShow flag is set (without overriding existing value)
  const ensureMeWantToShow = (dataKey: string) => {
    const myId = getSessionKey();
    const current = (
      roomUsersInfo[myId] as Record<string, RoomUsersDataField> | undefined
    )?.[dataKey];
    if (current?.wantToShow) return; // already set
    setRoomUsersInfo((state) => {
      const prevData = state[myId] || {};
      type Dyn = Record<string, RoomUsersDataField>;
      const prevField = (prevData as Dyn)[dataKey] || {};
      return {
        ...state,
        [myId]: {
          ...prevData,
          [dataKey]: {
            ...prevField,
            wantToShow: true,
            // leave value as-is (undefined) so observer/fetch can populate
            value: prevField.value,
          },
        },
      } as RoomUsersInfo;
    });
  };

  const acceptTradeOffer = async (el: Omit<MessageState, "id">) => {
    if (!isLoggedIn) return;
    if (!isChatActive) {
      throwDebugMessage(t("acceptTradeOfferError"));
    }

    const myId = getSessionKey();
    const dataKey = el.headers.dataKey as string;

    const iAmAcceptor = el.author === myId;
    const iAmOffererAndGotAcceptance = el.author !== myId;

    // Guards depending on role
    if (iAmAcceptor && !isInterlocutorWantToShow(dataKey)) return;
    if (iAmOffererAndGotAcceptance && !isMeWantToShow(dataKey)) return;

    // Ensure my wantToShow is marked (especially for acceptor path)
    ensureMeWantToShow(dataKey);

    const fetchedValue = await resolveMyValue(dataKey);

    // IMPORTANT: first persist my data so when the message component mounts it already sees value
    sendUserData(dataKey, fetchedValue);

    // then append the message (batched with state update -> reduces flash of "Oczekiwanie…")
    const newMessage: MessageState = { ...el, id: String(messages.length + 1) };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  // Helper: persist my data for a given key into roomUsersInfo (idempotent)
  const sendUserData = (
    dataKey: string,
    value: RoomUsersDataField["value"] | null
  ) => {
    const myId = getSessionKey();
    setRoomUsersInfo((state) => {
      const prevData = state[myId] || {};
      type Dyn = Record<string, RoomUsersDataField>;
      const prevField = (prevData as Dyn)[dataKey] || {};

      const sameValue =
        JSON.stringify(prevField.value) === JSON.stringify(value) &&
        prevField.wantToShow === true;
      if (sameValue) return state;

      return {
        ...state,
        [myId]: {
          ...prevData,
          [dataKey]: {
            ...prevField,
            value,
            wantToShow: true,
          },
        },
      } as RoomUsersInfo;
    });
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

  const updateRoomUsersInfo: UpdateRoomUsersInfo = (clientId, newData) => {
    setRoomUsersInfo((state) => {
      const oldValue = String(state[clientId]);
      const newValue = String(newData);

      if (oldValue === newValue) return state; // Jeśli dane się nie zmieniły, nie aktualizuj stanu

      return {
        ...state,
        [clientId]: newData,
      };
    });
  };
  // TODO: trzeba dorobić funkcję inicjującą ten stan od zera
  const initializeRoomUsersInfo: InitializeRoomUsersInfo = (obj) => {
    setRoomUsersInfo(obj);
  };

  const resetProvidersToDefault = () => {
    setMessages([]);
    setChatId(null);
    // TODO: dodać roomUsersInfo
  };

  const changeTradeDataPopoverOpen: ChangeTradeDataPopoverOpen = (value) => {
    setTradeDataPopoverOpen(value);
  };

  const getInterlocutorData = (dataKey: string) => {
    const myId = getSessionKey();
    const ids = Object.keys(roomUsersInfo || {});
    const interlocutorId = ids.find((id) => id !== myId);
    const valueOfInterlocutor = interlocutorId
      ? (
          roomUsersInfo[interlocutorId] as
            | Record<string, RoomUsersDataField>
            | undefined
        )?.[dataKey]
      : null;

    return valueOfInterlocutor;
  };

  // Helper: resolve my value for a given dataKey (session for username, API for others)
  const resolveMyValue = useCallback(
    async (dataKey: string): Promise<RoomUsersDataField["value"] | null> => {
      if (dataKey === "username") {
        return (
          typeof session?.user?.name === "string" ? session.user.name : null
        ) as RoomUsersDataField["value"] | null;
      }
      // If API helpers were removed earlier, guard
      try {
        const fetched = await getMyAccountDetailField(
          dataKey as unknown as AccountDetailsFieldKey
        );
        return (fetched ?? null) as RoomUsersDataField["value"] | null;
      } catch {
        return null;
      }
    },
    [session?.user?.name]
  );

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

  useDeleteRoomOnDisconnectEffect(chatStage, chatId);

  useResetProviderOnSearching(chatStage, resetProvidersToDefault);

  // Observer: when both wantToShow are true and interlocutor has a value, fill my value if missing
  useEffect(() => {
    if (!isLoggedIn || !isChatActive) return;

    const myId = getSessionKey();
    const ids = Object.keys(roomUsersInfo || {});
    const interlocutorId = ids.find((id) => id !== myId);
    if (!interlocutorId) return;

    const myData = roomUsersInfo[myId] as
      | Record<string, RoomUsersDataField>
      | undefined;
    const otherData = roomUsersInfo[interlocutorId] as
      | Record<string, RoomUsersDataField>
      | undefined;
    if (!myData || !otherData) return;

    const keys = Array.from(
      new Set([...Object.keys(myData), ...Object.keys(otherData)])
    );

    let cancelled = false;
    (async () => {
      for (const key of keys) {
        const meField = myData[key];
        const otherField = otherData[key];
        const bothWantToShow =
          !!meField?.wantToShow && !!otherField?.wantToShow;
        const otherHasValue = otherField && otherField.value !== undefined;
        const meMissingValue = !meField || meField.value === undefined;
        if (bothWantToShow && otherHasValue && meMissingValue) {
          const value = await resolveMyValue(key);
          if (cancelled) return;
          sendUserData(key, value);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomUsersInfo, isLoggedIn, isChatActive, resolveMyValue]);

  return (
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
        roomUsersInfo,
        tradeDataPopoverOpen,
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
          updateRoomUsersInfo,
          initializeRoomUsersInfo,
          changeTradeDataPopoverOpen,
          sendInterlocutorDataMessage,
          getInterlocutorData,
        }}
      >
        <AblyRoomProvider chatId={chatId}>{children}</AblyRoomProvider>
      </ChatActionCtx.Provider>
    </ChatStateCtx.Provider>
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
