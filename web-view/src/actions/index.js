import {LOAD_GH_RELEASE, LOAD_METRICS} from "./types";
import axios from 'axios';

export const fetchGitHubRelease = (release = 'latest') => async dispatch => {
    const response = await axios.get(`https://api.github.com/repos/paslavsky/java-microservices/releases/${release}`);
    dispatch({
        type: LOAD_GH_RELEASE,
        payload: response.data
    });

    const metricsAsset = response.data.assets.find(it => it.name === 'metrics.json');
    fetchMetrics(response.data.id, metricsAsset.id, metricsAsset.browser_download_url)(dispatch)
};

export const fetchMetrics = (releaseId, assetId, url) => async dispatch => {
    let data;
    const dataStr = localStorage.getItem(`${releaseId}:${assetId}`);
    if (dataStr) {
        data = JSON.parse(dataStr);
    } else {
        const response = await axios.get(`https://cors-anywhere.herokuapp.com/${url}`).catch(reason =>
            (axios.get('https://api.allorigins.win/get?url=' + encodeURIComponent(url)))
        );
        data = response.data.contents ? JSON.parse(response.data.contents) : response.data;
        localStorage.setItem(`${releaseId}:${assetId}`, JSON.stringify(data));
    }

    dispatch({
        type: LOAD_METRICS,
        payload: data
    });
};
