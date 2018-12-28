import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const dataSuiteApiUrl = `${baseUrl}/changes/api/v1`;

const urls = {
  get: {
    list: `${dataSuiteApiUrl}/list/`,
  },
  post: {
    commit: `${dataSuiteApiUrl}/commit/`,
  },
  delete: {
  },
};

const getUser = () => (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});

const getHeaders = () => ({
  headers: {
    Authorization: `Token ${getUser().token}`,
  },
});

// Changes GET requests
const list = () => axios.get(urls.get.list, getHeaders());
// Changes POST requests
const commit = selected => axios.post(urls.post.commit, { selected }, getHeaders());

const changesService = {
  get: {
    list,
  },
  post: {
    commit,
  },
  delete: {
  },
};

export default changesService;
