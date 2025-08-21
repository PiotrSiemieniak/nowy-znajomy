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
