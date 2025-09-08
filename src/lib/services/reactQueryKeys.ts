export const queryKeys = {
  // Account queries
  account: {
    all: ['account'] as const,
    details: () => [...queryKeys.account.all, 'details'] as const,
    field: (field: string) => [...queryKeys.account.details(), field] as const,
    profile: (id: string) => [...queryKeys.account.all, 'profile', id] as const,
  },
  
  // Chat queries
  chat: {
    all: ['chat'] as const,
    rooms: () => [...queryKeys.chat.all, 'rooms'] as const,
    room: (roomId: string) => [...queryKeys.chat.rooms(), roomId] as const,
    messages: (roomId: string) => [...queryKeys.chat.room(roomId), 'messages'] as const,
  },
  
  // Waiting room queries
  waitingRoom: {
    all: ['waitingRoom'] as const,
    status: () => [...queryKeys.waitingRoom.all, 'status'] as const,
    queue: () => [...queryKeys.waitingRoom.all, 'queue'] as const,
  },
};