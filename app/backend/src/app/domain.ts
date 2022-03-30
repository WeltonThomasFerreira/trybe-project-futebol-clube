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
  id?: number;
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

export interface GoalsStatus {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface ClubPlusMatch {
  id: number;
  clubName: string;
  homeClub: NewMatch[];
  awayClub: NewMatch[];
}
