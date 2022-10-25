import {TarotPlayerImpl} from "./player";
import {MockedGameRepository} from "./__mock__/mocked-game.repository";
import {MockedTable} from "./__mock__/mocked-table";
import {Announce} from "tarot-game-engine";
import {DECK_78, DIAMOND_K} from "tarot-card-deck";

describe(`Player`, function () {

    let notifyCallback = jest.fn();
    const playerName = "NAME";
    const playerId = "ID";
    const tableId = "TABLE_ID";
    const tableName = "TABLE_NAME"
    const mockedGameRepository = new MockedGameRepository();
    const mockedTable = new MockedTable(tableId, tableName, jest.fn());
    mockedGameRepository.createTable.mockReturnValue(mockedTable)

    let player: TarotPlayerImpl;

    beforeEach(() => {
        notifyCallback = jest.fn();
        player = new TarotPlayerImpl(playerName, playerId, notifyCallback, mockedGameRepository)
    })

    test(`Given a game repository and a player,
        when player creates a table,
        then table is created and joined`, () => {
        mockedGameRepository.join.mockImplementation(() => {
            mockedTable.join(player)
            return mockedTable;
        })

        player.performAction({
            action: "CREATE_TABLE",
            tableName: tableName
        })
        expect(mockedTable.join).toHaveBeenCalled()
    });

    test(`Given a game repository and a player that has already created a table,
        when player creates a second table,
        then table already joined notification is sent to player`, () => {
        mockedGameRepository.join.mockImplementation(() => {
            mockedTable.join(player)
            return mockedTable;
        })

        player.performAction({
            action: "CREATE_TABLE",
            tableName: tableName
        })
        player.performAction({
            action: "CREATE_TABLE",
            tableName: tableName
        })

        expect(notifyCallback).toHaveBeenCalledWith({type: "TABLE_ALREADY_JOINED", tableId: tableId})

    });

    test(`Given a game repository and a player,
        when player joins a table that exists,
        then table is joined`, () => {
        mockedGameRepository.join.mockImplementation(() => {
            mockedTable.join(player)
            return mockedTable;
        })

        player.performAction({
            action: "JOIN_TABLE",
            tableId: tableId
        })
        expect(mockedTable.join).toHaveBeenCalled()
    });

    test(`Given a game repository and a player that has already joined a table,
        when player creates another table,
        then table already joined notification is sent to player`, () => {
        mockedGameRepository.join.mockImplementation(() => {
            mockedTable.join(player)
            return mockedTable;
        })

        player.performAction({
            action: "JOIN_TABLE",
            tableId: tableId
        })
        player.performAction({
            action: "CREATE_TABLE",
            tableName: tableName
        })

        expect(notifyCallback).toHaveBeenCalledWith({type: "TABLE_ALREADY_JOINED", tableId: tableId})

    });


    test(`Given a game repository and a player,
        when player joins a table that does not exists,
        then table not found notification is sent`, () => {
        mockedGameRepository.join.mockReturnValue(null)

        player.performAction({
            action: "JOIN_TABLE",
            tableId: tableId
        })
        expect(notifyCallback).toHaveBeenCalledWith({type: "TABLE_NOT_FOUND", tableId: tableId})
    });

    test(`Given a game repository and a player that has already joined a table,
        when player joins another table,
        then table already joined notification is sent`, () => {
        mockedGameRepository.join.mockImplementation(() => {
            mockedTable.join(player)
            return mockedTable;
        })

        player.performAction({
            action: "JOIN_TABLE",
            tableId: tableId
        })
        player.performAction({
            action: "JOIN_TABLE",
            tableId: "ANOTHER_TABLE"
        })
        expect(notifyCallback).toHaveBeenCalledWith({type: "TABLE_ALREADY_JOINED", tableId: tableId})
    });

    test(`Given a game repository and a player that has joined a table,
        when player announces on table,
        then announce is done`, () => {
        mockedGameRepository.join.mockImplementation(() => {
            mockedTable.join(player)
            return mockedTable;
        })

        player.performAction({
            action: "JOIN_TABLE",
            tableId: tableId
        })

        player.performAction({
            action: "ANNOUNCE",
            announce: Announce.GARDE
        })

        expect(mockedTable.announce).toHaveBeenCalledWith(player, Announce.GARDE)
    });

    test(`Given a game repository and a player that has not joined a table,
        when player perform some game action,
        then no table joined notification is sent to player`, () => {
        mockedGameRepository.join.mockImplementation(() => {
            mockedTable.join(player)
            return mockedTable;
        })

        player.performAction({
            action: "ANNOUNCE",
            announce: Announce.GARDE
        })
        expect(notifyCallback).toHaveBeenCalledWith({
            type: "NO_TABLE_JOINED",
        })
    });

    test(`Given a game repository and a player that has joined a table,
        when player set aside on table,
        then set aside is done`, () => {
        mockedGameRepository.join.mockImplementation(() => {
            mockedTable.join(player)
            return mockedTable;
        })

        mockedTable.getDeck.mockReturnValue(DECK_78)

        const cardSetAside = DECK_78[0];
        player.performAction({
            action: "JOIN_TABLE",
            tableId: tableId
        })

        player.performAction({
            action: "SET_ASIDE",
            cards: [cardSetAside.identifier]
        })

        expect(mockedTable.setAside).toHaveBeenCalledWith(player, [cardSetAside])
    });

    test(`Given a game repository and a player that has joined a table,
        when player plays on table,
        then play is done`, () => {
        mockedGameRepository.join.mockImplementation(() => {
            mockedTable.join(player)
            return mockedTable;
        })

        mockedTable.getDeck.mockReturnValue(DECK_78)

        player.performAction({
            action: "JOIN_TABLE",
            tableId: tableId
        })

        player.performAction({
            action: "PLAY",
            card: "KD"
        })

        expect(mockedTable.play).toHaveBeenCalledWith(player, DIAMOND_K)
    });
});
