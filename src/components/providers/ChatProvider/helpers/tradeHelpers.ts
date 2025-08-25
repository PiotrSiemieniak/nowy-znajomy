import { MessageState, RoomUsersInfo, RoomUsersDataField } from "../types";
import { throwDebugMessage } from "@/lib/services/throwDebugMessage";
import { getSessionKey } from "@/lib/getSessionKey";
import {
  getMyAccountDetailField,
  AccountDetailsFieldKey,
} from "@/lib/services/api/accountDetails";

export const createSendTradeOfferMessage = (
  isLoggedIn: boolean,
  isChatActive: boolean,
  messages: MessageState[],
  setMessages: (fn: (prev: MessageState[]) => MessageState[]) => void,
  setRoomUsersInfo: (fn: (prev: RoomUsersInfo) => RoomUsersInfo) => void,
  t: (key: string) => string
) => (el: Omit<MessageState, "id">) => {
  if (!isLoggedIn) return;
  if (!isChatActive) {
    throwDebugMessage(t("sendInterlocutorDataError"));
  }

  const myId = getSessionKey();
  const newMessage: MessageState = { ...el, id: String(messages.length + 1) };

  setMessages((prevMessages) => [...prevMessages, newMessage]);
  
  if (el.author === myId) {
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

export const isInterlocutorWantToShow = (dataKey: string, roomUsersInfo: RoomUsersInfo): boolean => {
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

export const isMeWantToShow = (dataKey: string, roomUsersInfo: RoomUsersInfo): boolean => {
  const myId = getSessionKey();
  const field = (
    roomUsersInfo[myId] as Record<string, RoomUsersDataField> | undefined
  )?.[dataKey];
  return !!field?.wantToShow;
};

export const sendUserData = (
  dataKey: string,
  value: RoomUsersDataField["value"] | null,
  setRoomUsersInfo: (fn: (prev: RoomUsersInfo) => RoomUsersInfo) => void
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

export const resolveMyValue = async (
  dataKey: string,
  sessionUserName?: string | null
): Promise<RoomUsersDataField["value"] | null> => {
  if (dataKey === "username") {
    return (
      typeof sessionUserName === "string" ? sessionUserName : null
    ) as RoomUsersDataField["value"] | null;
  }
  
  try {
    const fetched = await getMyAccountDetailField(
      dataKey as unknown as AccountDetailsFieldKey
    );
    return (fetched ?? null) as RoomUsersDataField["value"] | null;
  } catch {
    return null;
  }
};
