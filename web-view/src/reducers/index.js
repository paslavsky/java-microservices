import {combineReducers} from "redux";
import ghReducer from './gh-reducer';
import metricsReducer from './metrics-reducer';
import docsReducer from './docs-reducer';

export default combineReducers({
    ghRelease: ghReducer,
    metrics: metricsReducer,
    docs: docsReducer
});
