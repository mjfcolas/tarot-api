import {GameRepository} from "../game.repository";

export class MockedGameRepository implements GameRepository {
    createPlayer = jest.fn();
    createTable = jest.fn();
    get = jest.fn();
    join = jest.fn();
    observeTables = jest.fn();
}
