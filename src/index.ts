import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) =>{
    console.log("user connected #");
    
    socket.on("message", (message) =>{
        const parsedMessage = JSON.parse(message as unknown as string);

        if(parsedMessage.type === 'join'){
            console.log("user joined room "+parsedMessage.payload.roomId)
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            }); 
        }
        if(parsedMessage.type === 'chat'){
            console.log("user wants to chat")
            const currentUserRoom = allSockets.find((x) => x.socket == socket);

            if(!currentUserRoom) return;

            for(let i = 0;i< allSockets.length; i++){
                if(allSockets[i].room == currentUserRoom.room){
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });

    socket.on("disconnect", ()=>{
        allSockets = allSockets.filter(x => x.socket != socket);
    });
});