import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';
import * as store from './store.js';

let connectedUserDetails;

const defaultConstraints = {
    audio : true,
    video : true
}

export const getLocalPreview = () => {
    navigator.mediaDevices.getUserMedia(defaultConstraints)
    .then(stream => {
        ui.updateLocalVideo(stream);
        store.setLocalStream(stream);
    }).catch(err => {
        console.log("Error banchod");
        console.log(err);
    })
}

export const sendPreOffer = (callType,calleePersonalCode) => {
    connectedUserDetails = {
        callType,
        socketId : calleePersonalCode
    }
    if(callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE){
        const data = {
            callType,
            calleePersonalCode
        }
        ui.showCallingDialog(callingDialogRejectHandler);
        wss.sendPreOffer(data);
    }
}

export const handlePreOffer = (data) => {
    const {callType , callerSocketId} = data;
    connectedUserDetails = {
        socketId : callerSocketId,
        callType
    }
    if(callType === constants.callType.CHAT_PERSONAL_CODE || callType === constants.callType.VIDEO_PERSONAL_CODE){
        ui.showIncomingCallDialog(callType , acceptCallHandler , rejectCallHandler);
    }
}

const acceptCallHandler = () => {
    console.log("call accepted");
    sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
    ui.showCallElements(connectedUserDetails.callType);
}

const rejectCallHandler = () => {
    console.log("call rejected");
    sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
}

const callingDialogRejectHandler = () => {
    console.log("Dhur bara abar rejection");
}

const sendPreOfferAnswer = (preOfferAnswer) => {
    const data = {
        callerSocketId : connectedUserDetails.socketId,
        preOfferAnswer
    }
    ui.removeAllDialogs();
    wss.sendPreOfferAnswer(data);
}

export const handlePreOfferAnswer = (data) => {
    const { preOfferAnswer } = data;
    console.log(data);
    ui.removeAllDialogs();
    if(preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND){
        ui.showInfoDialog(preOfferAnswer);
        // show dialog that callee has not been found
    }
    if(preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED){
        ui.showInfoDialog(preOfferAnswer);
        // show dialog callee is not able to connect
    }
    if(preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED){
        ui.showInfoDialog(preOfferAnswer);
        // show dialog that call is rejected by callee
    }
    if(preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED){
        ui.showCallElements(connectedUserDetails.callType);
;        // send webrtc offer
    }
}