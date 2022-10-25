import {TarotPlayerAtTable} from "../table";
import {PlayerIdentifier} from "tarot-game-engine";

export class MockedTarotPlayerAtTable implements TarotPlayerAtTable {

    constructor(public readonly id: PlayerIdentifier, public readonly name: string) {
    }

    public readonly notify = jest.fn();

}
