import {GET_DOC_FILE} from "../actions/types";

export default (state = {}, action) => {
    if (action.type === GET_DOC_FILE) {
        const newState = {...state};
        newState[action.payload.name] = action.payload;
        return newState;
    } else {
        return state;
    }
};
