import { useCallback } from "react";
import { generateColorPalette } from "../utils";
import {
  ChatStage,
  MessageState,
  TradeDataPopoverOpen,
  SelectedChannel,
  Filters,
  RoomUsersInfo,
  RoomUsersDataField,
} from "../types";
import { createSendMessage, createDisconnect } from "../helpers/chatHelpers";
import {
  createSendTradeOfferMessage,
  sendUserData,
  resolveMyValue,
  isInterlocutorWantToShow,
  isMeWantToShow,
} from "../helpers/tradeHelpers";
import {
  createToggleChannelAsSelected,
  createUpdateFilters,
} from "../helpers/channelsHelpers";

interface UseChatHandlersProps {
  // States
  bgColors: string[] | null;
  setBgColors: (colors: string[] | null) => void;
  setChatStage: (stage: ChatStage) => void;
  setChatId: (id: string | null) => void;
  messages: MessageState[];
  setMessages: (fn: (prev: MessageState[]) => MessageState[]) => void;
  setPopoverOpen: (open: boolean) => void;
  setTradeDataPopoverOpen: (value: TradeDataPopoverOpen) => void;
  selectedChannels: SelectedChannel[];
  setSelectedChannels: (
    fn: (prev: SelectedChannel[]) => SelectedChannel[]
  ) => void;
  setFilters: (fn: (prev: Filters) => Filters) => void;
  roomUsersInfo: RoomUsersInfo;
  setRoomUsersInfo: (fn: (prev: RoomUsersInfo) => RoomUsersInfo) => void;

  // Dependencies
  chatStage: ChatStage;
  chatId: string | null;
  isChatActive: boolean;
  isLoggedIn: boolean;
  sessionUserName?: string | null;
  t: (key: string, params?: Record<string, unknown>) => string;
}

export const useChatHandlers = ({
  // States
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

  // Dependencies
  chatStage,
  chatId,
  isChatActive,
  isLoggedIn,
  sessionUserName,
  t,
}: UseChatHandlersProps) => {
  const setNewBgColors = useCallback(
    (bgArray?: string[]) => {
      if (bgArray) setBgColors(bgArray);
      else setBgColors(generateColorPalette(15));
    },
    [setBgColors]
  );

  const changeChatState = useCallback(
    (stage: ChatStage) => setChatStage(stage),
    [setChatStage]
  );
  const changeChatId = useCallback(
    (value: string | null) => setChatId(value),
    [setChatId]
  );
  const handlePopoverOpen = useCallback(
    (condition: boolean) => setPopoverOpen(condition),
    [setPopoverOpen]
  );

  const toggleChannelAsSelected = useCallback(
    createToggleChannelAsSelected(selectedChannels, setSelectedChannels),
    [selectedChannels, setSelectedChannels]
  );

  const updateFilters = useCallback(createUpdateFilters(setFilters), [
    setFilters,
  ]);

  const sendMessage = useCallback(
    createSendMessage(isChatActive, messages, setMessages, t),
    [isChatActive, messages, setMessages, t]
  );

  const disconnect = useCallback(
    createDisconnect(chatStage, messages, setMessages, setChatStage, chatId),
    [chatStage, messages, setMessages, setChatStage, chatId]
  );

  const sendTradeOfferMessage = useCallback(
    createSendTradeOfferMessage(
      isLoggedIn,
      isChatActive,
      messages,
      setMessages,
      setRoomUsersInfo,
      t
    ),
    [isLoggedIn, isChatActive, messages, setMessages, setRoomUsersInfo, t]
  );

  const sendInterlocutorDataMessage = useCallback(
    async (el: Omit<MessageState, "id">) => {
      const type = el.headers.type;
      if (type === "interlocutorData") {
        sendTradeOfferMessage(el);
      } else if (type === "tradeAccepted") {
        await acceptTradeOffer(el);
      }
    },
    [sendTradeOfferMessage]
  );

  const acceptTradeOffer = useCallback(
    async (el: Omit<MessageState, "id">) => {
      if (!isLoggedIn || !isChatActive) return;

      const dataKey = el.headers.dataKey as string;
      const iAmAcceptor = el.author === "session-key"; // getSessionKey();

      if (iAmAcceptor && !isInterlocutorWantToShow(dataKey, roomUsersInfo))
        return;
      if (!iAmAcceptor && !isMeWantToShow(dataKey, roomUsersInfo)) return;

      const fetchedValue = await resolveMyValue(dataKey, sessionUserName);
      sendUserData(dataKey, fetchedValue, setRoomUsersInfo);

      const newMessage: MessageState = {
        ...el,
        id: String(messages.length + 1),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    },
    [
      isLoggedIn,
      isChatActive,
      roomUsersInfo,
      sessionUserName,
      messages,
      setMessages,
      setRoomUsersInfo,
    ]
  );

  const changeTradeDataPopoverOpen = useCallback(
    (value: TradeDataPopoverOpen) => {
      setTradeDataPopoverOpen(value);
    },
    [setTradeDataPopoverOpen]
  );

  const getInterlocutorData = useCallback(
    (dataKey: string) => {
      const myId = "session-key"; // getSessionKey();
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
    },
    [roomUsersInfo]
  );

  const updateRoomUsersInfo = useCallback(
    (clientId: string, newData: any) => {
      setRoomUsersInfo((state) => {
        const oldValue = String(state[clientId]);
        const newValue = String(newData);
        if (oldValue === newValue) return state;
        return {
          ...state,
          [clientId]: newData,
        };
      });
    },
    [setRoomUsersInfo]
  );

  const initializeRoomUsersInfo = useCallback(
    (obj: RoomUsersInfo) => {
      setRoomUsersInfo(() => obj);
    },
    [setRoomUsersInfo]
  );

  return {
    setNewBgColors,
    changeChatState,
    changeChatId,
    handlePopoverOpen,
    toggleChannelAsSelected,
    updateFilters,
    sendMessage,
    disconnect,
    sendInterlocutorDataMessage,
    acceptTradeOffer,
    changeTradeDataPopoverOpen,
    getInterlocutorData,
    updateRoomUsersInfo,
    initializeRoomUsersInfo,
  };
};
