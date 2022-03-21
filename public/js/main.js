import * as store from './store.js'
import * as wss from './wss.js'
import * as webrtchandler from './webrtchandler.js';
import * as constants from './constants.js';

// initialization of socket.io connection
const socket = io('/');
wss.registerSocketEvents(socket);

webrtchandler.getLocalPreview();

// registering event listener for personal code copy button
const personalCodeCopyButton = document.getElementById('personal_code_copy_button');
personalCodeCopyButton.addEventListener('click',() => {
    const personalCode = store.getState().socketId;
    navigator.clipboard && navigator.clipboard.writeText(personalCode);
    document.getElementById("copy_message").classList.remove('display_none')
    setTimeout(function(){
        document.getElementById("copy_message").classList.add("display_none");
    }, 1000);
})

// register event listeners for connection buttons
const personalCodeChatButton = document.getElementById('personal_code_chat_button');
const personalCodeVideoButton = document.getElementById('personal_code_video_button');
personalCodeChatButton.addEventListener('click' , () => {
    console.log('chat button clicked');
    const calleePersonalCode = document.getElementById('personal_code_input').value;
    const callType = constants.callType.CHAT_PERSONAL_CODE;
    webrtchandler.sendPreOffer(callType,calleePersonalCode);
})
personalCodeVideoButton.addEventListener('click' , () => {
    console.log('video button clicked');
    const calleePersonalCode = document.getElementById('personal_code_input').value;
    const callType = constants.callType.VIDEO_PERSONAL_CODE;
    webrtchandler.sendPreOffer(callType,calleePersonalCode);
})