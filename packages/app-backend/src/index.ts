export * from './lib/async';
export * from './lib/number';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import log from 'loglevel';


// Populate our environment variable shadows.
dotenv.config()
const LOG_LEVEL = (() => {
    const envLogLevel = process.env.REACT_APP_LOG_LEVEL;
    if (envLogLevel){
        if (envLogLevel === "TRACE"){
            return "TRACE"
        }
        if (envLogLevel === "DEBUG"){
            return "DEBUG"
        }
        if (envLogLevel === "INFO"){
            return "INFO"
        }
        if (envLogLevel === "WARN"){
            return "WARN"
        }
        
        if (envLogLevel === "ERROR"){
            return "ERROR"
        }
    }

    console.warn(`Provided environment log level is not supported: '${envLogLevel}'.\nDefaulting to log level 'INFO'.`)
    
    return "INFO"
})()
const EXPRESS_PORT = 5051;
const WEBSOCKET_PORT = 5050;

// Setup Logging
log.setLevel(LOG_LEVEL)
log.error(`> We are using LogLevel: ${LOG_LEVEL}. (This message is not actually an error -- it is provided at the least-verbose log level as a convenience.)`)

// Setup the Express app.
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello Reasonote!")
})

// An abstraction for socket-type communication.
// I'm not in love with it, but it will serve our use-cases for now.
export interface ISocketServer {
    sendToConnection(connectionId: string, msg: string): void;
    sendToChannel(channelId: string, msg: string): void;
    addMessageListener(channelId: string, connectionId: string, listener: (msg: string) => any): any;
    addConnectionOpenListener(listener: (channelId: string, connectionId: string) => any): any;
    addConnectionCloseListener(listener: (channelId: string, connectionId: string) => any): any;
}


class WebSocketServer implements ISocketServer {
    wss: WebSocket.Server
    channels: {[channelId: string]: {connectionIds: string[]}} = {}
    connections: {[connectionId: string]: {socket: WebSocket}} = {}
    listeners: {
        'open': ((channelId: string, connectionId: string) => any)[],
        'close': ((channelId: string, connectionId: string) => any)[], 
    } = {'open': [], 'close': []}

    constructor(port: number){
        this.wss = new WebSocket.Server({ port });

        this.wss.on('connection', (ws, req) => {
            const reqURL = req.url;
            const roomMatch = reqURL?.match(/.*\/exercises\/(.+)/)
            const channelId = roomMatch && roomMatch.length > 1 ? roomMatch[1] : undefined;

            if (channelId){
                const connectionId = uuidv4();
                this.connections[connectionId] = {socket: ws};
                
                if (!(channelId in this.channels)){
                    this.channels[channelId] = {connectionIds: []}
                }

                this.channels[channelId].connectionIds.push(connectionId);


                this.listeners.open.forEach((l) => l(channelId, connectionId))

                ws.on('close', () => {
                    this.listeners.close.forEach((l) => l(channelId, connectionId));
                })
            }            
        })
    }

    
    sendToConnection(connectionId: string, msg: string): void {
        if (connectionId in this.connections){
            this.connections[connectionId].socket.send(msg);
        }
    }
    sendToChannel(channelId: string, msg: string): void {
        if (channelId in this.channels){
            const connIds = this.channels[channelId].connectionIds;

            connIds.forEach((connId) => {
                if (connId in this.connections){
                    this.connections[connId].socket.send(msg);
                }
            })
        }
    }
    addMessageListener(channelId: string, connectionId: string, listener: (msg: string) => any) {
        if (channelId in this.channels && this.channels[channelId].connectionIds.includes(connectionId)){
            this.connections[connectionId].socket.addEventListener('message', (ev) => listener(ev.data));
        }
    }
    addConnectionOpenListener(listener: (channelId: string, connectionId: string) => any) {
        this.listeners.open.push(listener)
    }
    addConnectionCloseListener(listener: (channelId: string, connectionId: string) => any) {
        this.listeners.close.push(listener)
    }
}

// We use signalR if we have chosen to do so, and we have the right env vars.
const newWss = new WebSocketServer(WEBSOCKET_PORT);

// Throw an error if there was an issue creating our websocket server.
if (!newWss){
    throw new Error("Could not create socket.")
}

newWss?.addConnectionOpenListener((channelId, connectionId) => {
    console.log("got a connection!")

})

setInterval(
    () => {
       // TODO send periodic updates to listeners. 
    }, 
    5000
);

app.listen(EXPRESS_PORT, () => {
    log.info(`Example app listening at http://localhost:${EXPRESS_PORT}`)
})

export default "hello";