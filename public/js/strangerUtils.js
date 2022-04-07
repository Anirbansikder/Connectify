import * as wss from './wss.js';
import * as webRTCHandler from './webrtchandler.js'
import * as ui from './ui.js';

let strangerCallType;

export const changeStrangerCOnnectionStatus = status => {
    const data = {status};
    wss.changeStrangerCOnnectionStatus(data);
}

export const getStrangerSocketIdAndConnect = (callType) => {
    strangerCallType = callType;
    wss.getStrangerSocketIdAndConnect();
}

export const connectWithSTranger = data => {
    if(data.randomStrangerSocketId) {
        webRTCHandler.sendPreOffer(strangerCallType , data.randomStrangerSocketId);
    } else {
        // no user is available for connection
        ui.showNoStrangerAvailableDiialog();
    }
}