import {apiPlayerActionToPlayerAction, tableArrayToView} from "./mappers";
import {Announce} from "tarot-game-engine";
import {Table} from "../games/table";
import {MockedTarotPlayerAtTable} from "../games/__mock__/mocked-tarot-player-at-table";

describe(`Mapper`, () => {
    test(`Given an announce api player action with a known announce,
        when converting to player action,
        then return expected player action`, () => {
        expect(apiPlayerActionToPlayerAction({
            action: "ANNOUNCE",
            announce: "GARDE"
        })).toEqual({
            action: "ANNOUNCE",
            announce: Announce.GARDE
        })
    });

    test(`Given an announce api player action with no announce,
        when converting to player action,
        then return expected player action`, () => {
        expect(apiPlayerActionToPlayerAction({
            action: "ANNOUNCE",
            announce: "NOTHING"
        })).toEqual({
            action: "ANNOUNCE",
            announce: undefined
        })
    });

    test(`Given a play api player action with no announce,
        when converting to player action,
        then return expected player action`, () => {
        expect(apiPlayerActionToPlayerAction({
            action: "PLAY",
            card: "T1"
        })).toEqual({
            action: "PLAY",
            card: "T1"
        })
    });

    test(`Given an array of tables with one table on which one player has joined,
        when converting to all table views,
        then return expected result`, () => {
        const tableId = "TABLE_ID"
        const tableName = "TABLE_NAME"
        const playerId = "PLAYER_ID"
        const playerName = "PLAYER_NAME";
        const aPlayer = new MockedTarotPlayerAtTable(playerId, playerName);
        const table = new Table(tableId, tableName, jest.fn())
        table.join(aPlayer);
        expect(tableArrayToView([table]))
            .toEqual([{
                id: tableId,
                name: tableName,
                players: [
                    {
                        id: playerId,
                        name: playerName
                    }
                ],
                maxNumberOfPlayers: 4,
                numberOfPlayers: 1
            }])
    });
})
