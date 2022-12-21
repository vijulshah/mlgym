import SocketClass from '../websocket/SocketClass.js';

onmessage = (e) => {
    const data = e.data
    // console.log('Message from main thread = ', e.data);
    if(validateEventData(data)) {
        // console.log('Valid message data passed from main thread so taking related action');
        doAction(data);
    } else {
        console.log('Invalid message data passed from main thread so taking no action');
    }
}

const validateEventData = (data) => {
    //Validate all the request from main thread if you want to follow strict communication protocols
    //between main thread and the worker thread
    // if (data === "START") {
        return true;
    // }
    // else {
    //     return false;
    // }
}

let webSocket = null;

const workerOnMessageCallback = (data) => {
    postMessage(data)
}

const doAction = (reduxData) => {
    let result = {
        status: null
    }
    try {
        webSocket = new SocketClass(reduxData, workerOnMessageCallback);
        webSocket.init();
        result.status = "SUCCESS";
    }
    catch(e) {
        result.status = "FAIL";
    }
    postMessage(result);
}