import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const dataSuiteApiUrl = `${baseUrl}/data/api/v1`;

const urls = {
  get: {
    list: `${dataSuiteApiUrl}/list/`,
    detail: `${dataSuiteApiUrl}/detail/`,
    featureDetail: `${dataSuiteApiUrl}/feature_detail/`,
  },
  post: {
    createDataSet: `${dataSuiteApiUrl}/create_data_set/`,
    updateFeatureProperties: `${dataSuiteApiUrl}/update_feature_properties/`,
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

const fileUploadHeaders = () => ({
  headers: {
    Authorization: `Token ${getUser().token}`, // TODO: make the getHeaders function more general
    'Content-Type': 'multipart/form-data',
  },
});

// DataSuite GET requests
const list = () => axios.get(urls.get.list, getHeaders());
const detail = dataSetId => axios.get(`${urls.get.detail}${dataSetId}/`, getHeaders());
const featureDetail = featureId => axios.get(`${urls.get.featureDetail}${featureId}/`, getHeaders());
// DataSuite POST requests
const createDataSet = formData => axios.post(urls.post.createDataSet, formData, fileUploadHeaders());
const updateFeatureProperties = (openFeatureId, newFeatureProperties) =>
  axios.post(urls.post.updateFeatureProperties, { openFeatureId, newFeatureProperties }, getHeaders());

const dataSuiteService = {
  get: {
    list,
    detail,
    featureDetail,
  },
  post: {
    createDataSet,
    updateFeatureProperties,
  },
  delete: {
  },
};

export default dataSuiteService;
