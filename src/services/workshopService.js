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
    buildFinder: `${workshopApiUrl}/finder/`,
    instanceList: `${workshopApiUrl}/list_instances/`,
    locationPicketDataSet: `${workshopApiUrl}/location_picker/`,
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

const detail = (appLabel, modelName, id) =>
  axios.get(`${urls.get.detail}${buildQueryString({ al: appLabel, mn: modelName, id })}`, getHeaders());

const build = queryStringValues =>
  axios.get(`${urls.get.build}${buildQueryString(queryStringValues)}`, getHeaders());

const relatedFields = ({
  parentAppLabel, parentModelName, parentId, relatedAppLabel, relatedModelName, relatedFieldName,
}) => axios.get(
  `${urls.get.relatedFields}${buildQueryString({
    pal: parentAppLabel,
    pmn: parentModelName,
    pid: parentId,
    ral: relatedAppLabel,
    rmn: relatedModelName,
    rfn: relatedFieldName,
  })}`,
  getHeaders(),
);

const buildFinder = () => axios.get(urls.get.buildFinder, getHeaders());

const instanceList = relatedModelLabel =>
  axios.get(`${urls.get.instanceList}${buildQueryString({ rml: relatedModelLabel })}`, getHeaders());

const relatedInstanceList = (relatedModelLabel, modelLabel, fieldName, id) => axios.get(
  `${urls.get.instanceList}${buildQueryString({
    rml: relatedModelLabel,
    ml: modelLabel,
    fn: fieldName,
    id,
  })}`,
  getHeaders(),
);

const locationPickerDataSet = () => axios.get(urls.get.locationPicketDataSet, getHeaders());

// POST requests
const updateBasicFields = values => axios.post(urls.post.updateBasicFields, { ...values }, getHeaders());
const updateRelatedFields = updateData => axios.post(urls.post.updateRelatedField, { ...updateData }, getHeaders());
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
    buildFinder,
    instanceList,
    relatedInstanceList,
    locationPickerDataSet,
  },
  post: {
    updateBasicFields,
    updateRelatedFields,
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
