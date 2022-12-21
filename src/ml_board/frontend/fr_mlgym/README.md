# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Web-Workers

In this project, we have used web-workers which gives us the advantage of working on the tasks seperately from the main UI thread.<br/>

Initialising the WebSocket in the main thread would slow down the website and make it feel laggy since constantly it would be handling the server data that is pushed in through the WebSocket.<br/>

One way to do this efficiently is by initialising the WebSocket inside a WebWorker. WebWorker does not execute in the main thread instead it will be executed in a separate thread in parallel to the main thread which handles the rendering and handling of user actions.

To get a detailed understanding of these two Web API’s you can go through the following:<br/><br/>

WebSockets — https://blog.logrocket.com/websockets-tutorial-how-to-go-real-time-with-node-and-react-8e4693fbf843/ <br/><br/>

WebWorkers:<br/>
Video — https://youtu.be/Gcp7triXFjg <br/>
Blog — https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API <br/><br/>

WebSockets inside WebWorkers — https://jpsam7.medium.com/react-app-with-websocket-implemented-inside-webworker-aba6374e54f0 <br/><br/>

We will be getting streamable data from the our endpoint (can be localhost or a custom url).

The code to achieve this is split across 4 files.
1. App.js
2. DedicatedWorkerClass.js
3. SocketClass.js
4. worker.js

## App.js
`path: ./src/app/App.js` <br/><br/>
- Here, from the `componentDidMount` lifecycle method we trigger the `createWorker` function, which will create an instance of `DedicatedWorkerClass` and also sends a message to the worker "`START`" stating to initialise the WebSocket. `DedicatedWorkerClass` is a wrapper around the actual worker API.

- Inside `createWorker` we give the constructor of `DedicatedWorkerClass` the function `workerOnMessageHandler`.
This method is responsible for handling the messages sent from the worker to UI and do appropriate actions on the data returned. Here, we will be saving the data in redux state.

## DedicatedWorkerClass.js
`path: ./src/webworkers/DedicatedWorkerClass.js` <br/><br/>
- Inside the constructor of DedicatedWorkerClass we initialise the worker object. The name of the worker file doesn’t necessarily have to be `worker.js` you can name it as per your use case. 

## worker.js
`path: ./src/webworkers/worker.js`
- In this file, the `onmessage` method will set the `onmessage` handler of worker object. This event handler will be triggered whenever the main thread sends any message using the `postMessage` API (eg: "`START`" from `App.js`). Before we transfer the control to `doAction` method we validate the request data using `validateEventData` to make sure it follows the data communication pattern we have defined (For now I have sent true only if we send "`START`" command - see `postMessage` call in `App.js` ).

- We send the function `workerOnMessageCallback` as one of the parameters for the SocketClass. This function will be used by the Socket to post the data it is retrieving.

- We are following this pattern wherein we are sending a function to the Socket is that the `postMessage` function will not be available outside the worker scope.

- So when we try to access `postMessage` from inside SocketClass it will be `undefined`. Hence we pass a function callback which will be used to send the message from socket to worker and hence to the UI.

## SocketClass.js
`path: ./src/websocket/SocketClass.js`
- The init function of `SocketClass` in called from `worker.js` which initialises the webSocket with the streaming data URL endpoint.

- Once the WebSocket connection is opened, we subscribe to the `mlgym_event` of the websocket connection to the server.

- After we have subscribed to the data we will start receiving information from the back-end continuously. We handle these messages using `handleEventMessage` handler. It processes the data as required by the UI. (For example, `EVALUATION_RESULT` are handled by an event handler: `handleEvaluationResultData`)

- We send this info to the main thread using the `dataCallback` function which is the `workerOnMessageCallback` function in `worker.js` which uses the `postMessage` API of WebWorker to send the data back to the main thread (here, the data goes back to `workerOnMessageHandler` in `App.js` via `onMessage` method from `DedicatedWorkerClass.js`).

### And that’s how we get streaming data through WebSocket and WebWorker without blocking the main thread and slowing down the application. <br/><br/>

# Redux Data Structures

In this section, we specify the redux data structures used within the MLboard frontend.

We will be taking `evaluation_result` as an example to show the process.

The `evaluation_result` messages coming in via the websocket have the following format:

```python
{
    "event_type": "evaluation_result",
    "creation_ts": <unix timestamp>,
    "event_id": <int>
    "payload": {
        "epoch": <int>,
        "grid_search_id": <timestamp>, 
        "experiment_id": <int>,
        "metric_scores": [
            {
                "metric": <str>, 
                "split": <str>,
                "score": <float>
            }, 
            ...
        ],
        "loss_scores": [
            {
                "loss": <str>,, 
                "split": <str>,,
                "score": <float>
            },
            ...
        ]
    }
}
```

The messages from websocket are handled by event handlers stored in `path: src/websocket/event_handlers`. For Experiment Results, we have `handleExperimentStatusData`. Here we restructure the data and make it ready to be stored in redux.<br/>
This restructuring is happening in a thread seperate from UI thread.<br/>
Here, the data is structured as follows:

```python
    {
        "epoch": <int>,
        "grid_search_id": <timestamp>, 
        "experiment_id": <int>,
        [split]_[metric]: <list>, # eg: train_F1_SCORE_macro: [0.04199189495669321]
        [split]_[loss]: <list>,
    }
```

We would loop over metric_scores & loss_scores and get all the split-metric & split-loss pairs and add it to our dict.<br/>

Then `handleExperimentStatusData` returns this dict back to the SocketClass, which will invoke the callback function (`dataCallback`) of the `worker.js` - `workerOnMessageCallback`. This method will invoke the postMessage API which will send the data from webworker to UI (here, to `App.js`).

In `App.js`, the messages from webworkers are handled in `workerOnMessageHandler`. From this method, we save the dict directly into redux using the method: `this.props.saveEvalResultData(data);`

The redux store would look like this:

```python
[
    {
        epoch: 0, 
        experiment_id: 18, 
        grid_search_id: '2022-11-23--20-08-38',
        train_cross_entropy_loss: Array(1),
        train_F1_SCORE_macro: Array(1), …
    },
    {
        epoch: 0, 
        experiment_id: 20, 
        grid_search_id: '2022-11-23--20-08-38', 
        train_cross_entropy_loss: Array(1), 
        train_F1_SCORE_macro: Array(1), …
    },
    {
        epoch: 1, 
        experiment_id: 20, 
        grid_search_id: '2022-11-23--20-08-38', 
        train_cross_entropy_loss: Array(1), 
        train_F1_SCORE_macro: Array(1), …
    },
...
```

Note:: we can see `experiment_id: 20` has 2 entries but with different epochs. We are storing each epoch as dict in redux and will be merging different scores and losses in the component (eg: `Home.js`)- by parsing the array.