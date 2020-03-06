import {LOAD_METRICS} from "../actions/types";

export default (state = null, action) => {
    if (action.type === LOAD_METRICS) {
        return action.payload;
    } else {
        return state;
    }
};
