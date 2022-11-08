import {Table} from "../games/table";
import {AllTableViews, ApiPlayerAction, TableView} from "tarot-api-types";
import {PlayerAction} from "../games/player";
import {Announce} from "tarot-game-engine";

export const tableArrayToView: (tables: Table[]) => AllTableViews
    = (tables: Table[]) => tables.map(tableToView)

const tableToView: (table: Table) => TableView = (table: Table) => ({
    id: table.id,
    name: table.name,
    players: table.players.map(player => ({
        id: player.id,
        name: player.name
    })),
    maxNumberOfPlayers: table.maxNumberOfPlayers,
    numberOfPlayers: table.numberOfPlayers
});

export const apiPlayerActionToPlayerAction: (apiPlayerAction: ApiPlayerAction) => PlayerAction = (apiPlayerAction: ApiPlayerAction) => ({
    ...apiPlayerAction,
    announce: apiPlayerAction.action === "ANNOUNCE" ? Announce[apiPlayerAction.announce] : undefined
})
