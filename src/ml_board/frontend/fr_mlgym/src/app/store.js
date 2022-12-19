import { configureStore } from '@reduxjs/toolkit';
import ExperimentsReducer from '../redux/reducers/ExperimentsReducer';

const store = configureStore ({
    reducer: ExperimentsReducer
});

export default store;