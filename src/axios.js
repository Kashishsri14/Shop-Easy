import axios from "axios";

const instance = axios.create(
    {
        baseURL: 'http://127.0.0.1:9300/challenge-75ee6/us-central1/api'   // the API (cloud function) url

});

export default instance;

