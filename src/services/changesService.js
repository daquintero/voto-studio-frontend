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

// Add auth headers to ALL api requests
const api = axios.create({
  headers: { Authorization: `Token ${localStorage.getItem('userToken')}` },
});

// Changes GET requests
const list = () => api.get(urls.get.list);
// Changes POST requests
const commit = selected => api.post(urls.post.commit, { selected });

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
