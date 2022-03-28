export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserLogged {
  user: {
    id: number;
    username: string;
    role: string;
    email: string;
  };
  token: string;
}
