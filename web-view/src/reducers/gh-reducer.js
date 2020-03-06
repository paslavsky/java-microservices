import {LOAD_GH_RELEASE} from "../actions/types";

export default (state = null, action) => {
    if (action.type === LOAD_GH_RELEASE) {
        return action.payload;
    } else {
        return state;
    }
};
