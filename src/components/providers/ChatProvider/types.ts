import type { UserAccount } from "@/lib/globalTypes/account";
import type { AccountDetails } from "@/lib/globalTypes/accountDetails";
import { Gender } from "@/lib/globalTypes/personal/gender";
import { SportType } from "@/lib/globalTypes/personal/sports";
import { SpecialFeatures } from "@/lib/globalTypes/personal/specialFeatures";
import { MusicGenre } from "@/lib/globalTypes/personal/musicGenre";
import type { Message } from "@ably/chat";

// Prosto z typu Ably
export declare enum MessageType {
    /** Fires when a new chat message is received. */
    Created = "message.created",
    /** Fires when a chat message is updated. */
    Updated = "message.updated",
    /** Fires when a chat message is deleted. */
    Deleted = "message.deleted"
}

export type MessageState = {
  id: string;
  author: string;
  
  // text: string;
  // author: string;
  // createdAt: Date;
  // timestamp: Date;
  // type: MessageType;
  // version: string;
  // headers: {
  //   [x: string]: string | number | boolean | null | undefined
  // };
} & Message

// Channels

export type SelectedChannel = Pick<ChannelData, "id" | "name">

export type ChannelData = {
  id: string;
  name: string;
  onlineCount: number;
}

export type ChannelsListData = {
  regions: ChannelData[] | undefined;
  topics: ChannelData[] | undefined;
  group: ChannelData[] | undefined;
}

export type Filters = {
  ageRange: [number, number],
  gender: Gender,
  heightRange: [number, number],
  weightRange: [number, number]
}

export enum ChatStage {
  Initial = "initial",
  Connected = "connected",
  Disconnected = "disconnected",
  Searching = "searching"
} 

// RoomUsersInfo
export type RoomUsersAllowedValue = string | number | Gender | SportType[] | SpecialFeatures[] | MusicGenre[]
export type RoomUsersDataField = {
  wantToShow?: boolean
  value?: RoomUsersAllowedValue | null
}
type AccountDetailsKeysButAccountId = keyof Omit<AccountDetails, "accountId">
export type RoomUserData = Record<UsernameFromAccount, RoomUsersDataField> & Record<AccountDetailsKeysButAccountId, RoomUsersDataField>
export type RoomUsersInfo = { [userId: string]: RoomUserData }
export type UpdateRoomUsersInfo = (clientId: string, newData: RoomUserData) => void;
export type InitializeRoomUsersInfo = (obj: RoomUsersInfo) => void;

type UsernameFromAccount = keyof Pick<UserAccount, "username">
type AccountDetailsKeysStrings = keyof AccountDetails
export type TradeDataPopoverOpen = AccountDetailsKeysStrings | UsernameFromAccount | null
export type ChangeTradeDataPopoverOpen = (value: TradeDataPopoverOpen) => void;
