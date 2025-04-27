export type MessageType = {
  id: string;
  text: string;
  author: string;
  date: string;
}

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