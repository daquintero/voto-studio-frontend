import axios from 'axios';
import buildUrl from '../shared/utils/buildUrl';
import getHeaders from '../shared/utils/getHeaders';

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

// GET requests
const list = () => axios.get(urls.get.list, getHeaders());
const detail = dataSetId => axios.get(buildUrl(urls.get.detail, { dataSetId }), getHeaders());
const featureDetail = featureId => axios.get(buildUrl(urls.get.featureDetail, { featureId }), getHeaders());

// POST requests
const createDataSet = formData => axios.post(urls.post.createDataSet, formData, getHeaders({
  'Content-Type': 'multipart/form-data',
}));
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
