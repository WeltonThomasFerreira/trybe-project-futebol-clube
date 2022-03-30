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

export interface NewMatch {
  homeTeam: number;
  awayTeam: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

export interface Teams {
  homeTeam: number;
  awayTeam: number;
}
