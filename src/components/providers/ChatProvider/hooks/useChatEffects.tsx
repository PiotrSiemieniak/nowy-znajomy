import { useEffect } from "react";
import {
  ChatStage,
  ChannelsListData,
  RoomUsersInfo,
  RoomUsersDataField,
} from "../types";
import { handlePopoverStateEffect } from "../helpers/chatHelpers";
import { createUpdateChannelsList } from "../helpers/channelsHelpers";
import { disconnectRoom } from "@/lib/services/api/room";
import { getSessionKey } from "@/lib/getSessionKey";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UseChatEffectsProps {
  bgColors: string[] | null;
  setNewBgColors: (bgArray?: string[]) => void;
  isPopoverOpen: boolean;
  setChannelsListData: (data: ChannelsListData) => void;
  chatId: string | null;
  chatStage: ChatStage;
  pathname: string;
  searchParams: URLSearchParams | null;
  router: AppRouterInstance;
  resetProvidersToDefault: () => void;
  roomUsersInfo: RoomUsersInfo;
  isLoggedIn: boolean;
  isChatActive: boolean;
  resolveMyValue: (key: string) => Promise<RoomUsersDataField["value"] | null>;
  sendUserData: (
    key: string,
    value: RoomUsersDataField["value"] | null
  ) => void;
}

export const useChatEffects = ({
  bgColors,
  setNewBgColors,
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
  resolveMyValue,
  sendUserData,
}: UseChatEffectsProps) => {
  // Handle empty bgColors
  useEffect(() => {
    if (bgColors === null) setNewBgColors();
  }, [bgColors, setNewBgColors]);

  // Handle popover state effect
  useEffect(() => {
    handlePopoverStateEffect(isPopoverOpen);
  }, [isPopoverOpen]);

  // Handle channels list updates
  useEffect(() => {
    const updateChannelsList = createUpdateChannelsList(setChannelsListData);
    updateChannelsList();

    const interval = setInterval(() => {
      updateChannelsList();
    }, 120000);

    return () => clearInterval(interval);
  }, [setChannelsListData]);

  // Handle URL params sync
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

  // Handle room disconnect
  useEffect(() => {
    const sessionKey = getSessionKey();

    if (chatStage === ChatStage.Disconnected && sessionKey && chatId) {
      disconnectRoom({
        sessionKey,
        roomId: chatId,
      });
    }
  }, [chatStage, chatId]);

  // Handle provider reset
  useEffect(() => {
    if (chatStage === ChatStage.Searching) resetProvidersToDefault();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatStage]);

  // Handle room users observer
  useEffect(() => {
    if (!isLoggedIn || !isChatActive) return;

    const myId = "session-key"; // getSessionKey();
    const ids = Object.keys(roomUsersInfo || {});
    const interlocutorId = ids.find((id) => id !== myId);
    if (!interlocutorId) return;

    const myData = roomUsersInfo[myId];
    const otherData = roomUsersInfo[interlocutorId];
    if (!myData || !otherData) return;

    const keys = Array.from(
      new Set([...Object.keys(myData), ...Object.keys(otherData)])
    );

    let cancelled = false;
    (async () => {
      for (const key of keys) {
        const meField = (myData as Record<string, RoomUsersDataField>)[key];
        const otherField = (otherData as Record<string, RoomUsersDataField>)[
          key
        ];
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
  }, [roomUsersInfo, isLoggedIn, isChatActive, resolveMyValue, sendUserData]);
};
