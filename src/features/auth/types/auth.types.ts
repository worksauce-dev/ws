export interface SignUpData {
  email: string;
  password: string;
  name: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}
