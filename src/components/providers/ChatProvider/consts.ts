import { Gender } from "@/lib/globalTypes/personal/gender"
import { type Filters, type RoomUsersInfo } from "./types"
import { MAX_AGE, MAX_HEIGHT, MAX_WAGE, MIN_AGE, MIN_HEIGHT, MIN_WAGE } from "@/configs/filters"
import { getSessionKey } from "@/lib/getSessionKey"

export const DEFAULT_CHANNELS_LIST_DATA = {
  group: undefined,
  regions: undefined,
  topics: undefined,
}
export const DEFAULT_SELECTED_CHANNELS = []
export const DEFAULT_FILTERS: Filters = {
  ageRange: [MIN_AGE, MAX_AGE],
  gender: Gender.undefined,
  heightRange: [MIN_HEIGHT, MAX_HEIGHT],
  weightRange: [MIN_WAGE, MAX_WAGE]
}
export const DEFAULT_ROOM_USERS_INFO: RoomUsersInfo = {
    [getSessionKey()]: {}
  }