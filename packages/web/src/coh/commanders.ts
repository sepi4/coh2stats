import * as allCommandersJSON from "./data/cu2021/commanderData.json";
import { CommanderData, RaceName } from "./types";

const allCommanders: Record<string, any> = (allCommandersJSON as Record<string, any>)["default"];

const searchCommanders = (search: string, searchAbilities = false): Array<CommanderData> => {
  const searchRegExp = new RegExp(search.toLowerCase(), "g");
  const foundCommanders = Object.values(allCommanders).filter((commanderData) => {
    const evalPerName: boolean =
      commanderData["commanderName"].toLowerCase().match(searchRegExp) != null;
    let evalPerAbility =
      commanderData["abilities"].find((ability: any) => {
        return ability["name"].toLowerCase().match(searchRegExp) != null;
      }) != null;

    evalPerAbility = searchAbilities ? evalPerAbility : false;

    return evalPerAbility || evalPerName;
  });
  return foundCommanders;
};

const convertCommanderIDToName = (commanderID: string): string => {
  if (Object.prototype.hasOwnProperty.call(allCommanders, commanderID)) {
    return allCommanders[commanderID]["commanderName"];
  } else {
    // In case we don't know the commander number
    return `${commanderID}`;
  }
};

const getCommanderData = (commanderID: string): CommanderData | null => {
  if (Object.prototype.hasOwnProperty.call(allCommanders, commanderID)) {
    let commander = allCommanders[commanderID] as CommanderData;
    return decorateCommanderData(commander);
  } else {
    return null;
  }
};

const getCommanderByRaces = (raceName: RaceName): Array<CommanderData> => {
  return Object.values(allCommanders)
    .map((commander) => decorateCommanderData(commander))
    .filter((commanderData) => {
      return commanderData["races"][0] === raceName;
    });
};

const getCommanderIconPath = (name: string): string => {
  return `/resources/exportedIcons/${name}.png`;
};

const decorateCommanderData = (commander: CommanderData): CommanderData => {
  return {
    ...commander,
    abilities: commander.abilities.sort((a, b) => {
      return +a.commandPoints < +b.commandPoints ? -1 : 1;
    }),
  };
};

export {
  convertCommanderIDToName,
  getCommanderData,
  getCommanderByRaces,
  getCommanderIconPath,
  searchCommanders,
};
