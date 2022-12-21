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

Note:: we can see `experiment_id: 20` has 2 entries but with different epochs. We are storing each epoch as dict in redux and will be merging different scores and losses in the component (eg: `Home.js`)- by parsing the array. <br/><br/>