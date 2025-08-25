"use client";

import {
  useContextSelector,
  ChatStateCtx,
  ChatActionCtx,
} from "@/components/providers/ChatProvider";
import { SelectedChannel } from "@/components/providers/ChatProvider/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/Command";
import { cn } from "@/lib/utils";

const SEARCH_PLACEHOLDER = "Tutaj wyszukaj kanał lub region...";

export function ChannelsList() {
  const channelsListData = useContextSelector(
    ChatStateCtx,
    (state) => state.channelsListData
  );
  const selectedChannels = useContextSelector(
    ChatStateCtx,
    (state) => state.selectedChannels
  );
  const toggleChannelAsSelected = useContextSelector(
    ChatActionCtx,
    (actions) => actions.toggleChannelAsSelected
  );

  const noChannelSelected = selectedChannels.length === 0;
  const channelsListKeys = Object.keys(channelsListData);

  function findChannelAsSelected(id: string): boolean {
    if (noChannelSelected) return Boolean(id === "0");
    return Boolean(selectedChannels.find((channel) => channel.id === id));
  }
  const handleCommandItemClick = (channel: SelectedChannel) => {
    toggleChannelAsSelected(channel);
  };

  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput placeholder={SEARCH_PLACEHOLDER} />
      <CommandList className="h-[50vh]">
        <CommandEmpty>No results found.</CommandEmpty>
        {channelsListKeys.map((key, index) => {
          const isNotFirst = index !== 0;
          const heading = key.charAt(0).toUpperCase() + key.slice(1);

          return (
            <>
              {isNotFirst && <CommandSeparator />}
              <CommandGroup heading={heading} key={key}>
                {(
                  channelsListData[key as keyof typeof channelsListData] || []
                ).map((region) => {
                  const isSelected = findChannelAsSelected(region.id);

                  return (
                    <CommandItem
                      onClickCapture={handleCommandItemClick.bind(null, region)}
                      key={region.id}
                      className={cn({
                        "font-semibold bg-accent": isSelected,
                      })}
                    >
                      <span>{region.name}</span>
                      <CommandShortcut>{region.onlineCount}</CommandShortcut>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          );
        })}
      </CommandList>
    </Command>
  );
}
