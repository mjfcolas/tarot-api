import {InMemoryGameRepository} from "./in-memory-game.repository";
import {TarotPlayerImpl} from "../games/player";
import {skip} from "rxjs";
import {TarotPlayerAtTable} from "../games/table";
import {PlayerIdentifier} from "tarot-game-engine";
import {MockedTarotGameApi} from "../games/__mock__/mocked-tarot-game";

class MockedTarotPlayerAtTable implements TarotPlayerAtTable {

    constructor(public readonly id: PlayerIdentifier, public readonly name: string) {
    }

    public readonly notify = jest.fn();

}


describe(`In Memory Game Repository`, () => {

    const aPlayerName = "PLAYER_NAME";
    const aTableName = "TABLE_NAME";

    const notificationCallBack = jest.fn();

    let gameRepository: InMemoryGameRepository;
    let mockedTarotGame: MockedTarotGameApi

    beforeEach(() => {
        const tarotGameProvider = (_, __, endOfGameCallback) => {
            mockedTarotGame = new MockedTarotGameApi(endOfGameCallback)
            return mockedTarotGame;
        }
        gameRepository = new InMemoryGameRepository(tarotGameProvider)
    })

    test(`Given a name and a notification callback,
        when creating a player,
        then player is created and returned`, () => {
        const createdPlayer: TarotPlayerImpl = gameRepository.createPlayer(aPlayerName, notificationCallBack)
        expect(createdPlayer.name).toEqual(aPlayerName)
    });

    test(`Given a name and an observation of tables,
        when creating a table,
        then table is created and returned and observation is notified`, (done) => {
        gameRepository.observeTables().pipe(skip(1)).subscribe(tables => {
            expect(tables[0].name).toEqual(aTableName)
            done();
        })
        const createdTable = gameRepository.createTable(aTableName)
        expect(createdTable.name).toEqual(aTableName)
    });

    test(`Given a created table,
        when getting table,
        then table is returned`, () => {
        const createdTable = gameRepository.createTable(aTableName)
        expect(gameRepository.get(createdTable.id).name).toEqual(aTableName)
    });

    test(`Given a created player and a created table,
        when player joins the table,
        then table is returned and observation is notified`, (done) => {
        gameRepository.observeTables().pipe(skip(2)).subscribe(tables => {
            expect(tables[0].numberOfPlayers).toEqual(1)
            done();
        })
        const createdTable = gameRepository.createTable(aTableName)
        const createdPlayer: TarotPlayerImpl = gameRepository.createPlayer(aPlayerName, notificationCallBack)
        gameRepository.join(createdTable.id, createdPlayer.id)
    });

    test(`Given a created table,
        when unknown player joins the table,
        then no error is thrown and no one has joined table`, () => {
        const createdTable = gameRepository.createTable(aTableName)
        gameRepository.join(createdTable.id, "UNKWNOWN_PLAYER_ID")
        expect(createdTable.players.length).toEqual(0)
    });

    test(`Given a player,
        when player joins unknown table,
        then no error is thrown`, () => {
        const createdPlayer: TarotPlayerImpl = gameRepository.createPlayer(aPlayerName, notificationCallBack)
        gameRepository.join("UNKWNON_TABLE_ID", createdPlayer.id)
    });

    test(`Given a created table on which game has begun,
        when game is over,
        then table is removed from ongoing tables`, (done) => {
        gameRepository.observeTables().pipe(skip(2)).subscribe(tables => {
            expect(tables.length).toEqual(0)
            done();
        })
        const createdTable = gameRepository.createTable(aTableName)
        createdTable.join(new MockedTarotPlayerAtTable("P1", "P1"));
        createdTable.join(new MockedTarotPlayerAtTable("P2", "P2"))
        createdTable.join(new MockedTarotPlayerAtTable("P3", "P3"));
        createdTable.join(new MockedTarotPlayerAtTable("P4", "P4"))
        mockedTarotGame.endGame();
    });
})
