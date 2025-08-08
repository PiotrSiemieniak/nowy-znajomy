import type { AccountDetails, UserAccount } from "@/lib/globalTypes/account";
import { Gender } from "@/lib/globalTypes/personal/gender";
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


export type RoomUserData = Partial<Pick<UserAccount, "username">> & {
  accountId?: string;
  clientId?: string;
  details?: Omit<AccountDetails, "accountId">;
}
export type RoomUsersInfo = { [userId: string]: RoomUserData }
export type UpdateRoomUsersInfo = (clientId: string, newData: RoomUserData) => void;
export type InitializeRoomUsersInfo = (obj: RoomUsersInfo) => void;

type UsernameFromAccount = keyof Pick<UserAccount, "username">
type AccountDetailsKeysStrings = keyof AccountDetails
export type TradeDataPopoverOpen = AccountDetailsKeysStrings | UsernameFromAccount | null
export type ChangeTradeDataPopoverOpen = (value: TradeDataPopoverOpen) => void;
