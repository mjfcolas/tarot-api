import {Announce, GameResultWithDeck, PlayerIdentifier, TarotPlayer, TarotPlayerNotification} from "tarot-game-engine";
import {DECK_78, PlayingCard} from "tarot-card-deck";
import {Observable, Subject} from "rxjs";
import {TarotGameApi, TarotGameProvider} from "./tarot-game-api";

export type NamedPlayer = {
    name: string,
    id: PlayerIdentifier
}
export type TableNotification = {
    type: "GAME_BEGIN",
    players: NamedPlayer[]
} | {
    type: "PLAYER_HAS_JOINED",
    newPlayer: NamedPlayer,
    players: NamedPlayer[]
} | {
    type: "TABLE_IS_FULL"
} | {
    type: "TABLE_JOINED",
    tableId: string
} | {
    type: "GAME_NOT_STARTED"
}

export type TarotPlayerAtTableNotification = TarotPlayerNotification | TableNotification

export interface TarotPlayerAtTable extends TarotPlayer {
    name: string

    notify(notification: TarotPlayerAtTableNotification): void;
}

export class Table {
    public readonly maxNumberOfPlayers = 4;
    public readonly players: TarotPlayerAtTable[] = [];
    private tarotGame: TarotGameApi = null;
    private notifyEndOfGame: Subject<GameResultWithDeck> = new Subject<GameResultWithDeck>()

    constructor(public readonly id, public readonly name, private readonly tarotGameProvider: TarotGameProvider) {
    }

    public join(newPlayer: TarotPlayerAtTable): Table {
        if (this.numberOfPlayers >= this.maxNumberOfPlayers) {
            newPlayer.notify({
                type: "TABLE_IS_FULL"
            })
            return;
        }
        this.players.push(newPlayer);
        newPlayer.notify({
            type: "TABLE_JOINED",
            tableId: this.id
        });
        this.players.forEach(player => player.notify({
            type: "PLAYER_HAS_JOINED",
            newPlayer: {
                id: newPlayer.id,
                name: newPlayer.name
            },
            players: this.players.map(innerPlayer => ({
                id: innerPlayer.id,
                name: innerPlayer.name
            }))
        }))

        if (this.numberOfPlayers === this.maxNumberOfPlayers) {
            this.players.forEach(player => player.notify({
                type: "GAME_BEGIN",
                players: this.players.map(innerPlayer => ({
                    id: innerPlayer.id,
                    name: innerPlayer.name
                }))
            }))
            this.tarotGame = this.tarotGameProvider(
                this.getDeck(),
                this.players,
                (gameResult) => {
                    this.notifyEndOfGame.next(gameResult);
                    this.notifyEndOfGame.complete();
                });
        }
        return this;
    }

    public getDeck(): readonly PlayingCard[] {
        return DECK_78;
    }

    public get numberOfPlayers(): number {
        return this.players.length;
    }

    public announce(playerThatAnnounce: TarotPlayerAtTable, announce?: Announce) {
        this.performActionIfGameStarted(
            playerThatAnnounce,
            () => this.tarotGame.announce(playerThatAnnounce, announce));
    }

    public setAside(playerThatSetAside: TarotPlayerAtTable, cardsSetAside: PlayingCard[]) {
        this.performActionIfGameStarted(
            playerThatSetAside,
            () => this.tarotGame.setAside(playerThatSetAside, cardsSetAside));
    }

    public play(playerThatPlay: TarotPlayerAtTable, card: PlayingCard) {
        this.performActionIfGameStarted(
            playerThatPlay,
            () => this.tarotGame.play(playerThatPlay, card));
    }

    public observeEndOfGame(): Observable<GameResultWithDeck> {
        return this.notifyEndOfGame.asObservable();
    }

    private performActionIfGameStarted(player: TarotPlayerAtTable, action) {
        if (!this.tarotGame) {
            player.notify({
                type: "GAME_NOT_STARTED",
            });
            return;
        }
        action();
    }
}
