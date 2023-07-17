import { IPartialResults } from '../Interfaces/Leaderboard/IPartialResults';
import { IMatch } from '../Interfaces/Matches/IMatch';

function makeRawTable(games: IMatch[]): IPartialResults[] {
  return games.reduce((acc: IPartialResults[], cur: IMatch) => {
    if (acc.find(({ name }) => name === cur.homeTeam?.teamName)) return acc;
    acc.push({
      name: cur.homeTeam?.teamName as string,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: '0',
    });
    return acc;
  }, []);
}

function modifyTeam(team: IPartialResults, game: IMatch): IPartialResults {
  const updTeam = team;
  if (game.homeTeamGoals - game.awayTeamGoals > 0) {
    updTeam.totalVictories += 1;
    updTeam.totalPoints += 3;
  } else if (game.homeTeamGoals - game.awayTeamGoals === 0) {
    updTeam.totalDraws += 1;
    updTeam.totalPoints += 1;
  } else {
    updTeam.totalLosses += 1;
  }
  updTeam.goalsFavor += game.homeTeamGoals;
  updTeam.goalsOwn += game.awayTeamGoals;
  updTeam.totalGames += 1;
  updTeam.goalsBalance = updTeam.goalsFavor - updTeam.goalsOwn;
  updTeam.efficiency = ((updTeam.totalPoints / (updTeam.totalGames * 3)) * 100).toFixed(2);
  return updTeam;
}

function sortBoard(board: IPartialResults[]): IPartialResults[] {
  return board.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
    return b.goalsFavor - a.goalsFavor;
  });
}

export default function calculateHomePoints(games: IMatch[]): IPartialResults[] {
  const rawTable = makeRawTable(games);
  const updatedTable = games.reduce((acc, cur) => {
    const currentTeam = acc.findIndex(({ name }) => name === cur.homeTeam?.teamName);
    acc[currentTeam] = modifyTeam(acc[currentTeam], cur);
    return acc;
  }, rawTable);
  return sortBoard(updatedTable);
}
