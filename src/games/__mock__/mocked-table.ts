import {Table} from "../table";

export class MockedTable extends Table {
    join = jest.fn();
    getDeck = jest.fn();
    announce = jest.fn();
    setAside = jest.fn();
    play = jest.fn();
}
