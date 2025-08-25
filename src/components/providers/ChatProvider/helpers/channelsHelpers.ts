import { ChannelsListData, SelectedChannel, Filters } from "../types";
import { mockRegions } from "../mocks";

export const createUpdateChannelsList = (
  setChannelsListData: (data: ChannelsListData) => void
) => () => {
  // TODO: This function uses mocked data
  setChannelsListData({
    regions: mockRegions,
    topics: mockRegions,
    group: mockRegions,
  });
};

export const createToggleChannelAsSelected = (
  selectedChannels: SelectedChannel[],
  setSelectedChannels: (fn: (prev: SelectedChannel[]) => SelectedChannel[]) => void
) => (channel: SelectedChannel) => {
  const inArrayIndex = selectedChannels.findIndex(
    (selectedChannel) => selectedChannel.id === channel.id
  );
  const isChannelSelected = inArrayIndex !== -1;

  if (isChannelSelected) {
    setSelectedChannels((prev) =>
      prev.filter((_, index) => index !== inArrayIndex)
    );
  } else {
    setSelectedChannels((prev) => [...prev, channel]);
  }
};

export const createUpdateFilters = (
  setFilters: (fn: (prev: Filters) => Filters) => void
) => (newValue: Partial<Filters>) => {
  setFilters((prevValue) => ({
    ...prevValue,
    ...newValue,
  }));
};
