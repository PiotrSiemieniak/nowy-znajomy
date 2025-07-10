export type UserAccount = {
  username: string;
  usernameLower?: string;
  email: string;
  password: string;
  confirmation: {
    isConfirmed: boolean;
    confirmationSlug: string;
    confirmationCode: string;
    expireAt: string; // data do kiedy można potwierdzić konto (ISO)
  };
};

export type AccountDetails = {
  accountId: string;
  birthDate?: string;
  firstName?: string;
  lastName?: string;
  height?: number;
  nationality?: string;
  weight?: number;
};