type team = {
  teamName: string
};

export type matchGoals = {
  homeTeamGoals?: number,
  awayTeamGoals?: number
};

export type startingMatch = {
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
};

export interface IMatch {
  id: number;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
  homeTeam?: team,
  awayTeam?: team,
}
