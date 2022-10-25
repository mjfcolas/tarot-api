import {PlayingCard} from "tarot-card-deck";
import {Announce, GameResultWithDeck, TarotPlayer} from "tarot-game-engine";

export type TarotGameProvider = (
    playingCards: readonly PlayingCard[],
    players: readonly TarotPlayer[],
    endOfGameCallback: (gameResult: GameResultWithDeck) => void) => TarotGameApi

export interface TarotGameApi {
    announce(playerThatAnnounce: TarotPlayer, announce?: Announce): void;

    setAside(playerThatSetAside: TarotPlayer, cardsSetAside: PlayingCard[]): void;

    play(playerThatPlay: TarotPlayer, card: PlayingCard): void;
}
