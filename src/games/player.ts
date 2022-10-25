import {Announce, PlayerIdentifier} from "tarot-game-engine";
import {PlayingCard, PlayingCardIdentifier} from "tarot-card-deck";
import {Table, TarotPlayerAtTable, TarotPlayerAtTableNotification} from "./table";
import {GameRepository} from "./game.repository";

export type PlayerAction = {
    action: "CREATE_TABLE",
    tableName: string
} | {
    action: "JOIN_TABLE"
    tableId: string
} | {
    action: "ANNOUNCE",
    announce?: Announce
} | {
    action: "SET_ASIDE",
    cards: PlayingCardIdentifier[]
} | {
    action: "PLAY",
    card: PlayingCardIdentifier
}

type PlayerInternalNotification = {
    type: "TABLE_NOT_FOUND",
    tableId: string
} | {
    type: "TABLE_ALREADY_JOINED",
    tableId: string
} | {
    type: "NO_TABLE_JOINED"
}
export type PlayerNotification = PlayerInternalNotification | TarotPlayerAtTableNotification;

export class TarotPlayerImpl implements TarotPlayerAtTable {

    private table: Table = null;

    constructor(
        public readonly name: string,
        public readonly id: PlayerIdentifier,
        private readonly notifyCallback: (notification: PlayerNotification) => void,
        private readonly gameRepository: GameRepository
    ) {
    }


    notify(playerNotification: PlayerNotification): void {
        this.notifyCallback(playerNotification)
    }

    performAction(action: PlayerAction) {
        switch (action.action) {
            case "CREATE_TABLE":
                this.createTable(action.tableName);
                break;
            case "JOIN_TABLE":
                this.joinTable(action.tableId);
                break;
            case "ANNOUNCE":
                this.performGameAction(() => this.table.announce(this, Announce[action.announce]))
                break;
            case "SET_ASIDE":
                this.performGameAction(() => {
                    const playingCards: PlayingCard[] = action.cards
                        .map(currentId => this.table
                            .getDeck()
                            .find(currentPlayingCard => currentPlayingCard.identifier === currentId))
                    this.table.setAside(this, playingCards)
                })
                break;
            case "PLAY":
                const playingCard: PlayingCard = this.table
                    .getDeck()
                    .find(currentPlayingCard => currentPlayingCard.identifier === action.card)
                this.performGameAction(() => this.table.play(this, playingCard))
                break;
        }
    }

    private createTable(tableName: string) {
        if (this.table) {
            this.notify({
                type: "TABLE_ALREADY_JOINED",
                tableId: this.table.id
            });
            return;
        }
        const createdTable = this.gameRepository.createTable(tableName)
        this.joinTable(createdTable.id)
    }

    private joinTable(tableId: string) {
        if (this.table) {
            this.notify({
                type: "TABLE_ALREADY_JOINED",
                tableId: this.table.id
            });
            return;
        }
        const tableToJoin = this.gameRepository.join(tableId, this.id);
        if (!tableToJoin) {
            this.notify({
                type: "TABLE_NOT_FOUND",
                tableId: tableId
            });
            return;
        }
        this.table = tableToJoin;
    }

    private performGameAction(gameAction: () => void) {
        if (!this.table) {
            this.notify({
                type: "NO_TABLE_JOINED",
            });
            return;
        }
        gameAction();
    }
}
