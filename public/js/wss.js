import * as store from './store.js';
import * as ui from './ui.js';
import * as webrtchandler from './webrtchandler.js';

let socketIO = null;

export const registerSocketEvents = (socket) => {
    socketIO = socket;
    socket.on('connect',() => {
        console.log("Successfully Connected Through Web Socket Server");
        store.setSocketId(socket.id);
        ui.updatePersonalCode(socket.id);
    })
    socket.on("pre-offer" , (data) => {
        webrtchandler.handlePreOffer(data);
    })
    socket.on('pre-offer-answer' , (data) => {
        webrtchandler.handlePreOfferAnswer(data);
    })
}

export const sendPreOffer = (data) => {
    socketIO.emit('pre-offer',data);
}

export const sendPreOfferAnswer = (data) => {
    socketIO.emit('pre-offer-answer',data);
}