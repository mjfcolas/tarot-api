import {TarotGameProvider} from "../games/tarot-game-api";
import {
    CLUB_1,
    CLUB_10,
    CLUB_2,
    CLUB_3,
    CLUB_4,
    CLUB_5,
    CLUB_6,
    CLUB_7,
    CLUB_8,
    CLUB_9,
    CLUB_C,
    CLUB_J,
    CLUB_K,
    CLUB_Q,
    DIAMOND_1,
    DIAMOND_10,
    DIAMOND_2,
    DIAMOND_3,
    DIAMOND_4,
    DIAMOND_5,
    DIAMOND_6,
    DIAMOND_7,
    DIAMOND_8,
    DIAMOND_9,
    DIAMOND_C,
    DIAMOND_J,
    DIAMOND_K,
    DIAMOND_Q,
    EXCUSE,
    HEART_1,
    HEART_10,
    HEART_2,
    HEART_3,
    HEART_4,
    HEART_5,
    HEART_6,
    HEART_7,
    HEART_8,
    HEART_9,
    HEART_C,
    HEART_J,
    HEART_K,
    HEART_Q,
    PlayingCard,
    SPADE_1,
    SPADE_10,
    SPADE_2,
    SPADE_3,
    SPADE_4,
    SPADE_5,
    SPADE_6,
    SPADE_7,
    SPADE_8,
    SPADE_9,
    SPADE_C,
    SPADE_J,
    SPADE_K,
    SPADE_Q,
    TRUMP_1,
    TRUMP_10,
    TRUMP_11,
    TRUMP_12,
    TRUMP_13,
    TRUMP_14,
    TRUMP_15,
    TRUMP_16,
    TRUMP_17,
    TRUMP_18,
    TRUMP_19,
    TRUMP_2,
    TRUMP_20,
    TRUMP_21,
    TRUMP_3,
    TRUMP_4,
    TRUMP_5,
    TRUMP_6,
    TRUMP_7,
    TRUMP_8,
    TRUMP_9
} from "tarot-card-deck";
import {GameResultWithDeck, getTarotGameWithCustomDealFunction, TarotPlayer} from "tarot-game-engine";


const predictableDealFunction = deck => {
    const player0Cards: PlayingCard[] = [
        HEART_1, HEART_5, HEART_9, HEART_Q, CLUB_3, CLUB_7, CLUB_J, DIAMOND_1, DIAMOND_5, DIAMOND_9, DIAMOND_Q, SPADE_3, SPADE_7, SPADE_J, TRUMP_1, TRUMP_5, TRUMP_9, TRUMP_13,
    ]
    const player1Cards: PlayingCard[] = [
        HEART_2, HEART_6, HEART_10, HEART_K, CLUB_4, CLUB_8, CLUB_C, DIAMOND_10, DIAMOND_K, SPADE_4, SPADE_8, SPADE_C, TRUMP_2, TRUMP_6, TRUMP_10, TRUMP_14, TRUMP_3, TRUMP_7,
    ]
    const player2Cards: PlayingCard[] = [
        HEART_3, HEART_7, HEART_J, CLUB_1, CLUB_5, CLUB_9, CLUB_Q, DIAMOND_3, DIAMOND_7, DIAMOND_J, SPADE_1, SPADE_5, SPADE_9, SPADE_Q, TRUMP_11, TRUMP_15, DIAMOND_2, DIAMOND_6,
    ]
    const player3Cards: PlayingCard[] = [
        HEART_4, HEART_8, HEART_C, CLUB_2, CLUB_6, CLUB_10, CLUB_K, DIAMOND_4, DIAMOND_8, DIAMOND_C, SPADE_2, SPADE_6, SPADE_10, SPADE_K, TRUMP_4, TRUMP_8, TRUMP_12, TRUMP_16,
    ]

    const dog: PlayingCard[] = [
        TRUMP_17, TRUMP_18, TRUMP_19, TRUMP_20, TRUMP_21, EXCUSE
    ]

    return {
        playersDecks: [
            player0Cards, player1Cards, player2Cards, player3Cards
        ],
        dog: dog
    }
}

export const provideTarotGame: TarotGameProvider = (
    playingCards: readonly PlayingCard[],
    players: readonly TarotPlayer[],
    endOfGameCallback: (gameResult: GameResultWithDeck) => void
) => {
    return getTarotGameWithCustomDealFunction(
        playingCards,
        players,
        endOfGameCallback,
        predictableDealFunction)
};
