import { configureStore } from '@reduxjs/toolkit';
import ExperimentsReducer from 'src/redux/reducers/ExperimentsReducer';

const store = configureStore ({
    reducer: ExperimentsReducer
});

export default store;