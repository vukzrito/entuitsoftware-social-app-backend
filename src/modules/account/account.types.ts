export namespace AccountTypes {
  export type User = {
    uid: string;
    username: string;
    email: string;
    displayName: string;
    isEmailVerified: boolean;
    phoneNumber: string;
    photoUrl: string;
  };
  export type Creator = {
    approvedAt: string;
    subscriptionAmount: number;
    subscriptionCurrency: string;
    appleSKU: string;
    androidSKU: string;
    paystackSKU: string;
  };
  export type UserProfile = {
    userId: string;
    username: string;
    displayName: string;
    photoUrl: string;
  };
  export type UserFollow = {
    userId: string;
    followedAt: string;
  };
  export type UserFollower = {
    userId: string;
    followedAt: string;
  };

  export type UserAccount = User & {
    creator: Creator;
  };
}
