export namespace AuthTypes {
  export type User = {
    uid: string;
    email: string | undefined;
    emailVerified: boolean;
    displayName: string | undefined;
    photoURL: string | undefined;
    phoneNumber: string | undefined;
    disabled: boolean;
    metadata: {
      creationTime: string;
      lastSignInTime: string;
    };
    customClaims?: {
      [key: string]: any;
    };
    providerData: {
      uid: string;
      displayName: string | undefined;
      email: string | undefined;
      phoneNumber: string | undefined;
      photoURL: string | undefined;
      providerId: string;
    }[];
  };
}
