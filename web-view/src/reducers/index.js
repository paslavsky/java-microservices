import {combineReducers} from "redux";
import ghReducer from './gh-reducer';
import metricsReducer from './metrics-reducer';

export default combineReducers({
    ghRelease: ghReducer,
    metrics: metricsReducer
});
