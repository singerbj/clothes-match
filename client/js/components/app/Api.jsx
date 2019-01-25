import axios from 'axios';

let that = {
    source: undefined
};

export default {
    get: (url) => {
        if(that.source){
            that.source.cancel('Operation canceled by the user.');
        }
        const CancelToken = axios.CancelToken;
        that.source = CancelToken.source();
        return axios.get(url, {
            cancelToken: that.source.token
        }).then((response) => {
            // success
        }).catch((error) => {
            // error
        }).then((response) => {
            delete that.source;
        });
    },
    post: (url, config) => {
        if(that.source){
            that.source.cancel('Operation canceled by the user.');
        }
        const CancelToken = axios.CancelToken;
        that.source = CancelToken.source();
        return axios.post(url, config, {
            cancelToken: that.source.token
        }).then((response) => {
            // success
        }).catch((error) => {
            // error
        }).then((response) => {
            delete that.source;
        });
    },
    put: (url, config) => {
        if(that.source){
            that.source.cancel('Operation canceled by the user.');
        }
        const CancelToken = axios.CancelToken;
        that.source = CancelToken.source();
        return axios.post(url, config, {
            cancelToken: source.token
        }).then((response) => {
            // success
        }).catch((error) => {
            // error
        }).then((response) => {
            delete that.source;
        });
    },
    isCancel: function(thrown){
        return axios.isCancel(thrown);
    }
};
