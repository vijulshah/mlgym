import {
    EVAL_RESULT
} from '../actions/ExperimentActions.js';

const initialState = {
    evalResult: []
}

export default function expReducer(state = initialState, action) {
    switch (action.type) {
        case EVAL_RESULT:
            return {
                evalResult: [...state.evalResult, action.evalResultData]
            }
        default:
            return state;
    }
}