type team = {
  teamName: string
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
