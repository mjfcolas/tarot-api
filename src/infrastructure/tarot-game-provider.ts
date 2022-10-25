import {TarotGameProvider} from "../games/tarot-game-api";
import {PlayingCard} from "tarot-card-deck";
import {GameResultWithDeck, getTarotGame, TarotPlayer} from "tarot-game-engine";

export const provideTarotGame: TarotGameProvider = (
    playingCards: readonly PlayingCard[],
    players: readonly TarotPlayer[],
    endOfGameCallback: (gameResult: GameResultWithDeck) => void
) => {
    return getTarotGame(
        playingCards,
        players,
        endOfGameCallback)
};
