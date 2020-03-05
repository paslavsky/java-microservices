import {LOAD_GH_RELEASE, LOAD_METRICS} from "./types";
import axios from 'axios';

export const fetchGitHubRelease = (release = 'latest') => async dispatch => {
    const response = await axios.get(`https://api.github.com/repos/paslavsky/java-microservices/releases/${release}`);
    dispatch({
        type: LOAD_GH_RELEASE,
        payload: response.data
    });

    fetchMetrics(response.data.assets.find(it => it.name === 'metrics.json').browser_download_url)(dispatch)
};

export const fetchMetrics = url => async dispatch => {
    const response = await axios.get(`https://cors-anywhere.herokuapp.com/${url}`);
    dispatch({
        type: LOAD_METRICS,
        payload: response.data
    });
};
