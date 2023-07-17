import { IPartialResults } from '../Interfaces/Leaderboard/IPartialResults';
import { IMatch } from '../Interfaces/Matches/IMatch';

function makeRawTable(games: IMatch[], homeTeam: boolean): IPartialResults[] {
  return games.reduce((acc: IPartialResults[], cur: IMatch) => {
    if (acc.find(({ name }) => (homeTeam ? name === cur.homeTeam?.teamName
      : name === cur.awayTeam?.teamName))) return acc;
    acc.push({
      name: homeTeam ? cur.homeTeam?.teamName as string : cur.awayTeam?.teamName as string,
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

function modifyTeam(team: IPartialResults, game: IMatch, homeTeam: boolean): IPartialResults {
  const updTeam = team;
  const condition = homeTeam ? game.homeTeamGoals - game.awayTeamGoals
    : game.awayTeamGoals - game.homeTeamGoals;

  if (condition > 0) {
    updTeam.totalVictories += 1;
    updTeam.totalPoints += 3;
  } else if (condition === 0) {
    updTeam.totalDraws += 1;
    updTeam.totalPoints += 1;
  } else {
    updTeam.totalLosses += 1;
  }
  updTeam.totalGames += 1;
  updTeam.goalsFavor += homeTeam ? game.homeTeamGoals : game.awayTeamGoals;
  updTeam.goalsOwn += homeTeam ? game.awayTeamGoals : game.homeTeamGoals;
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

function sumGames(home: IPartialResults, visitor: IPartialResults): IPartialResults {
  const untreatedResult = {
    name: home.name,
    totalPoints: home.totalPoints + visitor.totalPoints,
    totalGames: home.totalGames + visitor.totalGames,
    totalVictories: home.totalVictories + visitor.totalVictories,
    totalDraws: home.totalDraws + visitor.totalDraws,
    totalLosses: home.totalLosses + visitor.totalLosses,
    goalsFavor: home.goalsFavor + visitor.goalsFavor,
    goalsOwn: home.goalsOwn + visitor.goalsOwn,
  };
  return {
    ...untreatedResult,
    goalsBalance: untreatedResult.goalsFavor - untreatedResult.goalsOwn,
    efficiency: ((untreatedResult.totalPoints / (untreatedResult.totalGames * 3)) * 100).toFixed(2),
  };
}

export function calculateHomePoints(games: IMatch[]): IPartialResults[] {
  const rawTable = makeRawTable(games, true);
  const updatedTable = games.reduce((acc, cur) => {
    const currentTeam = acc.findIndex(({ name }) => name === cur.homeTeam?.teamName);
    acc[currentTeam] = modifyTeam(acc[currentTeam], cur, true);
    return acc;
  }, rawTable);
  return sortBoard(updatedTable);
}

export function calculateAwayPoints(games: IMatch[]): IPartialResults[] {
  const rawTable = makeRawTable(games, false);
  const updatedTable = games.reduce((acc, cur) => {
    const currentTeam = acc.findIndex(({ name }) => name === cur.awayTeam?.teamName);
    acc[currentTeam] = modifyTeam(acc[currentTeam], cur, false);
    return acc;
  }, rawTable);
  return sortBoard(updatedTable);
}

export function calculateTotalPoints(games: IMatch[]): IPartialResults[] {
  const rawTable = makeRawTable(games, false);
  const homeTable = calculateHomePoints(games);
  const awayTable = calculateAwayPoints(games);
  const updatedTable = homeTable.reduce((acc, cur, i) => {
    const visitor = awayTable.find(({ name }) => name === cur.name);
    acc[i] = sumGames(cur, visitor as IPartialResults);
    return acc;
  }, rawTable);
  return sortBoard(updatedTable);
}

export default {
  calculateHomePoints,
  calculateAwayPoints,
  calculateTotalPoints,
};
