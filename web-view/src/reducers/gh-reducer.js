import {LOAD_GH_RELEASE} from "../actions/types";

export default (state = null, action) => {
    switch (action.type) {
        case LOAD_GH_RELEASE: return action.payload;
        default:
            return state;
    }
};
