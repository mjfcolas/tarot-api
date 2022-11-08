import {Table} from "./table";
import {MockedTarotPlayerAtTable} from "./__mock__/mocked-tarot-player-at-table";
import {DECK_78} from "tarot-card-deck";
import {Announce} from "tarot-game-engine";
import {MockedTarotGameApi} from "./__mock__/mocked-tarot-game";

describe(`Table`, () => {

    const aTableId = "ID";
    const aTableName = "NAME"
    let table: Table;

    let players;

    let mockedTarotGame: MockedTarotGameApi

    beforeEach(() => {
        const tarotGameProvider = (_, __, endOfGameCallback) => {
            mockedTarotGame = new MockedTarotGameApi(endOfGameCallback)
            return mockedTarotGame;
        }
        table = new Table(aTableId, aTableName, tarotGameProvider)
        players = [
            new MockedTarotPlayerAtTable("P1", "P1"),
            new MockedTarotPlayerAtTable("P2", "P2"),
            new MockedTarotPlayerAtTable("P3", "P3"),
            new MockedTarotPlayerAtTable("P4", "P4")
        ]
    })

    test(`Given a player that joins a table,
        then the player is notified that he has joined the table`, () => {
        table.join(players[0]);

        expect(players[0].notify).toHaveBeenCalledWith({tableId: aTableId, type: "TABLE_JOINED"});
    });

    test(`Given a table with one player that has joined the table,
        when the second player joins the table,
        then the first player is notified of a new player joining`, () => {
        table.join(players[0]);

        table.join(players[1])

        expect(players[0].notify).toHaveBeenCalledWith({
            type: "PLAYER_HAS_JOINED",
            newPlayer: {id: "P2", name: "P2"},
            players: [
                {id: "P1", name: "P1"},
                {id: "P2", name: "P2"}
            ]
        });
    });

    test(`Given a table with already 3 players,
        when the fourth player joins the table,
        then the four players are notified that the game begins`, () => {
        joinFourPlayers()

        const expectedGameBeginMessage = {
            type: "GAME_BEGIN",
            players: [
                {id: "P1", name: "P1"},
                {id: "P2", name: "P2"},
                {id: "P3", name: "P3"},
                {id: "P4", name: "P4"}
            ]
        };

        expect(players[0].notify).toHaveBeenCalledWith(expectedGameBeginMessage);
        expect(players[1].notify).toHaveBeenCalledWith(expectedGameBeginMessage);
        expect(players[2].notify).toHaveBeenCalledWith(expectedGameBeginMessage);
        expect(players[3].notify).toHaveBeenCalledWith(expectedGameBeginMessage);
    });

    test(`Given a table with already 4 players,
        when when a fifth player tries to join the table,
        then full table notification is sent to player`, () => {
        joinFourPlayers()

        const fifthPlayer = new MockedTarotPlayerAtTable("P5", "P5");

        table.join(fifthPlayer);
        expect(fifthPlayer.notify).toHaveBeenCalledWith({
            type: "TABLE_IS_FULL"
        })

    });

    test(`Given a table which is not full,
        when player tries to set aside,
        then game not started notification is sent to player`, () => {
        table.join(players[0]);
        table.setAside(players[0], []);
        expect(players[0].notify).toHaveBeenCalledWith({type: "GAME_NOT_STARTED"})
    });

    test(`Given a table which is not full,
        when player tries to play,
        then game not started notification is sent to player`, () => {
        table.join(players[0]);
        table.play(players[0], DECK_78[0]);
        expect(players[0].notify).toHaveBeenCalledWith({type: "GAME_NOT_STARTED"})
    });

    test(`Given a table which is not full,
        when player tries to announce,
        then game not started notification is sent to player`, () => {
        table.join(players[0]);
        table.announce(players[0], Announce.GARDE);
        expect(players[0].notify).toHaveBeenCalledWith({type: "GAME_NOT_STARTED"})
    });

    test(`Given a table which is not full,
        when player tries to announce poignee,
        then game not started notification is sent to player`, () => {
        table.join(players[0]);
        table.announcePoignee(players[0], []);
        expect(players[0].notify).toHaveBeenCalledWith({type: "GAME_NOT_STARTED"})
    });

    test(`Given a table which is not full,
        when player tries to decline poignee,
        then game not started notification is sent to player`, () => {
        table.join(players[0]);
        table.declinePoignee(players[0]);
        expect(players[0].notify).toHaveBeenCalledWith({type: "GAME_NOT_STARTED"})
    });

    test(`Given a game that has began,
        when player tries to set aside,
        then action is sent to game`, () => {
        joinFourPlayers();
        table.setAside(players[0], []);
        expect(mockedTarotGame.setAside).toHaveBeenCalledWith(players[0], [])
    });

    test(`Given a game that has began,
        when player tries to play,
        then action is sent to game`, () => {
        joinFourPlayers();
        table.play(players[0], DECK_78[0]);
        expect(mockedTarotGame.play).toHaveBeenCalledWith(players[0], DECK_78[0])
    });

    test(`Given a game that has began,
        when player tries to announce,
        then action is sent to game`, () => {
        joinFourPlayers();
        table.announce(players[0], Announce.GARDE);
        expect(mockedTarotGame.announce).toHaveBeenCalledWith(players[0], Announce.GARDE)
    });

    test(`Given a game that has began,
        when player tries to announce poignee,
        then action is sent to game`, () => {
        joinFourPlayers();
        table.announcePoignee(players[0], []);
        expect(mockedTarotGame.announcePoignee).toHaveBeenCalledWith(players[0], [])
    });

    test(`Given a game that has began,
        when player tries to decline poignee,
        then action is sent to game`, () => {
        joinFourPlayers();
        table.declinePoignee(players[0]);
        expect(mockedTarotGame.declinePoignee).toHaveBeenCalledWith(players[0])
    });

    test(`Given a game that has began and an observation on end of game,
        when game end,
        then end of game observation is triggered`, (done) => {
        table.observeEndOfGame().subscribe(() => done())
        joinFourPlayers();
        mockedTarotGame.endGame()
    });


    test(`Given a table with 2 players, 
    when getting number of players, 
    then returns 2`, () => {
        table.join(players[0]);
        table.join(players[1])
        expect(table.numberOfPlayers).toEqual(2)
    })

    test(`Given a table,
        when getting deck,
        then standard tarot deck is returned`, () => {
        expect(table.getDeck()).toEqual(DECK_78)
    });

    function joinFourPlayers() {
        table.join(players[0]);
        table.join(players[1])
        table.join(players[2]);
        table.join(players[3])
    }
})
