import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const workshopApiUrl = `${baseUrl}/forms/api/v1`;
const searchApiUrl = `${baseUrl}/search/api/v1`;

// TODO: Naming consistency!!!!!

const urls = {
  get: {
    list: `${workshopApiUrl}/list/`,
    detail: `${workshopApiUrl}/detail/`,
    build: `${workshopApiUrl}/build/`,
    relatedFields: `${workshopApiUrl}/related_fields/`,
  },
  post: {
    updateBasicFields: `${workshopApiUrl}/update_basic_fields/`,
    updateRelatedField: `${workshopApiUrl}/update_related_field/`,
    publish: `${workshopApiUrl}/publish/`,
  },
  delete: {
    item: `${workshopApiUrl}/delete_item/`,
  },
  search: {
    relatedFields: `${searchApiUrl}/related_fields/`,
  },
};

const buildQueryString = (params) => {
  const esc = encodeURIComponent;
  return `?${Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&')}`;
};

const getUser = () => (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});

const getHeaders = () => ({
  headers: {
    Authorization: `Token ${getUser().token}`,
  },
});

// GET requests
const list = () => axios.get(urls.get.list, getHeaders());
const detail = (appName, modelName, id) =>
  axios.get(`${urls.get.detail}${buildQueryString({ al: appName, mn: modelName, id })}`, getHeaders());
const build = ({ appName, modelName, id }) =>
  axios.get(`${urls.get.build}${buildQueryString({ al: appName, mn: modelName, id })}`, getHeaders());
const relatedFields = ({
  parentAppName, parentModelName, parentId, relatedAppName, relatedModelName, relatedFieldName,
}) => axios.get(
  `${urls.get.relatedFields}${buildQueryString({
    pal: parentAppName,
    pmn: parentModelName,
    pid: parentId,
    ral: relatedAppName,
    rmn: relatedModelName,
    rfn: relatedFieldName,
  })}`,
  getHeaders(),
);
// POST requests
const updateBasicFields = values => axios.post(urls.post.updateBasicFields, { ...values }, getHeaders());
const updateRelatedField = updateData => axios.post(urls.post.updateRelatedField, { ...updateData }, getHeaders());
const publish = () => axios.post(urls.post.publish, {}, getHeaders());
// DELETE requests
const item = (appLabel, modelName, id) =>
  axios.delete(urls.delete.item, { data: { appLabel, modelName, id }, ...getHeaders() });
// Search GET request
const searchRelatedFields = searchParameters =>
  axios.get(`${urls.search.relatedFields}${buildQueryString(searchParameters)}`, getHeaders());

const workshopService = {
  get: {
    list,
    detail,
    build,
    relatedFields,
  },
  post: {
    updateBasicFields,
    updateRelatedField,
    publish,
  },
  delete: {
    item,
  },
  search: {
    relatedFields: searchRelatedFields,
  },
};

export default workshopService;
