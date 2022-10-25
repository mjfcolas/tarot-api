import {randomUUID} from "crypto";
import {Table, TarotPlayerAtTable} from "../games/table";
import {BehaviorSubject, Observable} from "rxjs";
import {PlayerNotification, TarotPlayerImpl} from "../games/player";
import {GameRepository} from "../games/game.repository";
import {TarotGameProvider} from "../games/tarot-game-api";

export class InMemoryGameRepository implements GameRepository {
    private readonly players: Map<string, TarotPlayerAtTable> = new Map<string, TarotPlayerAtTable>();

    private readonly tables: Map<string, Table> = new Map<string, Table>();
    private readonly tableObservable = new BehaviorSubject<Table[]>([]);

    constructor(public readonly tarotGameProvider: TarotGameProvider) {
    }

    public createPlayer(name: string, notifyCallback: (notification: PlayerNotification, playerId: string) => void): TarotPlayerImpl {
        const newPlayerId = randomUUID();
        const newPlayer = new TarotPlayerImpl(
            name,
            newPlayerId,
            (notification) => notifyCallback(notification, newPlayerId),
            this
        )
        this.players.set(newPlayerId, newPlayer)
        return newPlayer
    }

    public createTable(tableName: string): Table {
        const tableUuid = randomUUID();
        const newTable: Table = new Table(tableUuid, tableName, this.tarotGameProvider);
        newTable.observeEndOfGame().subscribe(() => {
            this.tables.delete(tableUuid)
            this.tableObservable.next([...this.tables.values()])
        });
        this.tables.set(tableUuid, newTable)
        this.tableObservable.next([...this.tables.values()])
        return newTable;
    }

    public join(tableId: string, playerId: string): Table {
        const tableToJoin = this.get(tableId);
        if (!tableToJoin) {
            return;
        }
        const player = this.players.get(playerId);
        if (!player) {
            return;
        }
        const joinedTable = tableToJoin.join(player);
        this.tableObservable.next([...this.tables.values()])
        return joinedTable;
    }

    public get(tableIdentifier: string): Table {
        return this.tables.get(tableIdentifier);
    }

    public observeTables(): Observable<Table[]> {
        return this.tableObservable;
    }
}
