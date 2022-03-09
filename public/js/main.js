const socket = io('/');


socket.on('connect',() => {
    console.log("Successfully COnnected Through Web Socket Server");
    console.log(socket.id);
})