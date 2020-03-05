import {LOAD_METRICS} from "../actions/types";

export default (state = null, action) => {
    switch (action.type) {
        case LOAD_METRICS: return action.payload;
        default:
            return state;
    }
};
