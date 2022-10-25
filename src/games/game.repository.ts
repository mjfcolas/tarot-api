import {PlayerNotification, TarotPlayerImpl} from "./player";
import {Table} from "./table";
import {Observable} from "rxjs";

export abstract class GameRepository {

    public abstract createPlayer(name: string, notifyCallback: (notification: PlayerNotification, playerId: string) => void): TarotPlayerImpl;

    public abstract createTable(tableName: string): Table;

    public abstract join(tableId: string, playerId: string): Table;

    public abstract get(tableIdentifier: string): Table;

    public abstract observeTables(): Observable<Table[]>;
}
