import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import DedicatedWorkerClass from '../webworkers/DedicatedWorkerClass';
import { connect } from 'react-redux';
import { saveEvalResultData } from '../redux/actions/ExperimentActions';

class App extends Component {
    
    constructor(props) {
        super(props);
        this.mlgymWorker = null;
    }

    componentDidMount() {
        localStorage.clear();
        this.createWorker();
    }

    render() {
        return(
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="*" element={<div>404</div>} />
            </Routes>
        )
    }

    createWorker = () => {
        this.mlgymWorker = new DedicatedWorkerClass(this.workerOnMessageHandler);
        this.mlgymWorker.postMessage(this.props.evalResult);
    }

    workerOnMessageHandler = async(data) => {
        if(data && data.grid_search_id !== null && data.experiments !== undefined)
        {
            await this.props.saveEvalResultData(data);
            console.log("Data from redux = ",this.props.evalResult);
        }
    }
}

const mapStateToProps = (state) => ({
    evalResult: state.evalResult
});

const mapDispatchToProps = { saveEvalResultData };

export default connect(mapStateToProps, mapDispatchToProps)(App);