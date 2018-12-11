import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const dataSuiteApiUrl = `${baseUrl}/data/api/v1`;

const urls = {
  get: {
    list: `${dataSuiteApiUrl}/list/`,
    detail: `${dataSuiteApiUrl}/detail/`,
  },
  post: {
    createDataSet: `${dataSuiteApiUrl}/create_data_set/`,
  },
  delete: {
  },
};

// Add auth headers to ALL api requests
const api = axios.create({
  headers: { Authorization: `Token ${localStorage.getItem('userToken')}` },
});

// DataSuite GET requests
const list = () => api.get(urls.get.list);
const detail = dataSetId => api.get(`${urls.get.detail}${dataSetId}/`);
// DataSuite POST requests
const createDataSet = newDataSet => (
  api.post(urls.post.createDataSet, { newDataSet }, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Content-Disposition': newDataSet.file.name,
    },
  })
);

const tourService = {
  get: {
    list,
    detail,
  },
  post: {
    createDataSet,
  },
  delete: {
  },
};

export default tourService;
