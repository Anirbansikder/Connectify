const express = require("express");
const http = require("http");

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/" , (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
})

let connectedPeers = [];

io.on('connection',(socket) => {
    connectedPeers.push(socket.id); 
    socket.on('pre-offer' , (data) => {
        const {calleePersonalCode , callType} = data;
        const connectedPeer = connectedPeers.find((peerSocketId) => 
            peerSocketId === calleePersonalCode
        );
        if(connectedPeer){
            const newData = {
                callerSocketId : socket.id,
                callType,
            }
            io.to(connectedPeer).emit("pre-offer",newData);
        }
    })
    socket.on('disconnect' , () => {
        const newConnectedPeers = connectedPeers.filter((peerSocketId) => {
            return peerSocketId !== socket.id;
        })
        connectedPeers = newConnectedPeers;
    })
})

server.listen(PORT , () => {
    console.log(`Listening On Port ${PORT}`);
})