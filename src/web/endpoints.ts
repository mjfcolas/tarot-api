import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import expressWs from "express-ws"
import util from "util"
import {PlayerNotification, TarotPlayerImpl} from "../games/player";
import WebSocket from "ws";
import {
    AllTableViews,
    ApiPlayerAction,
    ApiUserNotification,
    CONNECT_ENDPOINT,
    WATCH_TABLE_ENDPOINT
} from "tarot-api-types";
import {apiPlayerActionToPlayerAction, tableArrayToView} from "./mappers";
import {InMemoryGameRepository} from "../infrastructure/in-memory-game.repository";
import {GameRepository} from "../games/game.repository";
import {provideTarotGame} from "../infrastructure/tarot-game-provider";

const gameRepository: GameRepository = new InMemoryGameRepository(provideTarotGame)
const PORT = 3000;
const httpApp = express();
httpApp.use(cors())
httpApp.use(bodyParser.json())
const httpServer = httpApp.listen(PORT)

const {app} = expressWs(httpApp, httpServer);

app.ws(WATCH_TABLE_ENDPOINT, (ws) => {
    gameRepository.observeTables().subscribe(tables => {
        const tableViews: AllTableViews = tableArrayToView(tables)
        ws.send(JSON.stringify(tableViews))
    })
})

app.ws(CONNECT_ENDPOINT, (ws, req) => {
    const name = (req.query.name || "unknown") as string;

    const notifyCallback = (notification: PlayerNotification, playerId) => notify(ws, notification, playerId);

    const player: TarotPlayerImpl = gameRepository.createPlayer(name, notifyCallback)

    ws.addEventListener("message", event => {
        const apiPlayerAction: ApiPlayerAction = JSON.parse(event.data as string);
        log(player.id, "FROM", apiPlayerAction)
        const playerAction = apiPlayerActionToPlayerAction(apiPlayerAction)
        player.performAction(playerAction);
    })

    notify(ws,
        {
            type: "GOT_IDENTIFIER",
            playerId: player.id,
            playerName: name
        },
        player.id)
    log(player.id, "FROM", {
        action: "connection",
        name: name
    })
})

function notify(ws: WebSocket, message: ApiUserNotification, playerId: string) {
    log(playerId, "TO", message)
    ws.send(JSON.stringify(message))
}

function log(playerId, toOrFrom: "TO" | "FROM", data) {
    console.log(util.inspect(
        {
            player: playerId,
            direction: toOrFrom,
            data: data
        },
        {
            showHidden: false,
            depth: null,
            colors: true
        }))
}
