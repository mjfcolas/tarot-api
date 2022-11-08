import {TarotGameApi} from "../tarot-game-api";

export class MockedTarotGameApi implements TarotGameApi {

    constructor(public readonly endGame) {
    }

    announce = jest.fn();
    play = jest.fn();
    setAside = jest.fn()
    announcePoignee = jest.fn()
    declinePoignee = jest.fn()
}
