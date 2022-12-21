import { io } from 'socket.io-client';
import EVENT_TYPE from './socketEventConstants.js';
import handleEvaluationResultData from './event_handlers/evaluationResultDataHandler.js';

const DEFAULT_URL = 'http://127.0.0.1:7000/';

class SocketClass {
    
    constructor(reduxData = undefined, dataCallback = null, socketURL = null) {
        this.reduxData = reduxData
        this.defaultURL = socketURL || DEFAULT_URL
        this.webSocket = null
        this.dataCallback = dataCallback
    }

    init = () => {
        let socket = io(this.defaultURL, { autoConnect: true });
        let runId = "mlgym_event_subscribers";
        
        socket.open();
        
        socket.emit('ping', () => {
            // console.log("ping");
        });
        
        socket.on('connect', () => {
            socket.emit('join', { rooms: [runId], client_id: "3000" });
        });

        socket.on('mlgym_event', (msg) => {
            try {
                let parsedMsg = JSON.parse(msg);
                this.handleEventMessage(parsedMsg);
            } 
            catch(error) {
                console.log("Websocket Event Error = ",error.message);
            }            
        });

        socket.on('connect_error', (err) => {
            console.log("connection error", err);
        })

        socket.on('disconnect', () => {
            console.log("disconnected");
        });

        socket.on('pong', () => {
            // console.log("pong");
        });
    }

    handleEventMessage = (parsedMsg) => {
        let eventType = parsedMsg["event_type"].toLowerCase();
        let result = null;

        switch(eventType) {
            case EVENT_TYPE.JOB_STATUS:
                console.log("Job Status found")
                break;
            case EVENT_TYPE.JOB_SCHEDULED:
                console.log("Job scheduled found")
                break;
            case EVENT_TYPE.EVALUATION_RESULT:
                result = handleEvaluationResultData(parsedMsg["payload"], this.reduxData);
                break;
            case EVENT_TYPE.EXPERIMENT_CONFIG:
                console.log("Exp config found")
                break;
            case EVENT_TYPE.EXPERIMENT_STATUS:
                console.log("Exp status found")
                break;
            default: throw new Error(EVENT_TYPE.UNKNOWN_EVENT);
        }
        // console.log(result);
        if (this.dataCallback) {
            this.dataCallback(result);
        }
    }
}

export default SocketClass;

// idea: is there a filter to fetch different event types from server? I am planning to create webworkers which will work asynchronously and fetch different events in parallel and keep updating the redux state. 