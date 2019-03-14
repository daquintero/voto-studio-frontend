import axios from 'axios';
import buildUrl from '../shared/utils/buildUrl';
import getHeaders from '../shared/utils/getHeaders';

const baseUrl = process.env.REACT_APP_BASE_URL;
const workshopApiUrl = `${baseUrl}/forms/api/v1`;
const searchApiUrl = `${baseUrl}/search/api/v1`;

const urls = {
  get: {
    list: `${workshopApiUrl}/list/`,
    detail: `${workshopApiUrl}/detail/`,
    build: `${workshopApiUrl}/build/`,
    relatedFields: `${workshopApiUrl}/get_related_fields/`,
    buildFinder: `${workshopApiUrl}/finder/`,
    instanceList: `${workshopApiUrl}/list_instances/`,
    relatedInstanceList: `${workshopApiUrl}/list_related_instances/`,
    locationPicketDataSet: `${workshopApiUrl}/location_picker/`,
  },
  post: {
    updateBasicFields: `${workshopApiUrl}/update_basic_fields/`,
    updateMediaField: `${workshopApiUrl}/update_media_field/`,
    updateMediaOrder: `${workshopApiUrl}/update_media_order/`,
    updateRelatedField: `${workshopApiUrl}/update_related_field/`,
    publishInstances: `${workshopApiUrl}/publish_instances/`,
  },
  delete: {
    instances: `${workshopApiUrl}/delete_instances/`,
  },
  search: {
    relatedFields: `${searchApiUrl}/related_fields/`,
  },
};

// GET requests
const list = () => axios.get(urls.get.list, getHeaders());

const detail = (appLabel, modelName, id) =>
  axios.get(buildUrl(urls.get.detail, { al: appLabel, mn: modelName, id }), getHeaders());

const build = queryStringValues =>
  axios.get(buildUrl(urls.get.build, queryStringValues), getHeaders());

const relatedFields = ({
  parentAppLabel, parentModelName, parentId, relatedAppLabel, relatedModelName, relatedFieldName,
}) => axios.get(buildUrl(urls.get.relatedFields, {
  pal: parentAppLabel,
  pmn: parentModelName,
  pid: parentId,
  ral: relatedAppLabel,
  rmn: relatedModelName,
  rfn: relatedFieldName,
}), getHeaders());

const buildFinder = () => axios.get(urls.get.buildFinder, getHeaders());

const instanceList = ({
  modelLabel, filter, page, pageSize, searchTerm,
}) => axios.get(buildUrl(urls.get.instanceList, {
  ml: modelLabel,
  filter,
  page,
  size: pageSize,
  search: searchTerm,
}), getHeaders());

const relatedInstanceList = ({
  relatedModelLabel, modelLabel, fieldName, filter, id, page, pageSize, searchTerm,
}) => axios.get(buildUrl(urls.get.relatedInstanceList, {
  rml: relatedModelLabel,
  ml: modelLabel,
  fn: fieldName,
  filter,
  id,
  page,
  size: pageSize,
  search: searchTerm,
}), getHeaders());

const locationPickerDataSet = ({ locationIdName }) =>
  axios.get(buildUrl(urls.get.locationPicketDataSet, { loc: locationIdName }), getHeaders());

// POST requests
const updateBasicFields = updateData => axios.post(urls.post.updateBasicFields, updateData, getHeaders());
const updateMediaField = updateData => axios.post(urls.post.updateMediaField, updateData, getHeaders());
const updateMediaOrder = orderData => axios.post(urls.post.updateMediaOrder, orderData, getHeaders());
const updateRelatedField = updateData =>
  axios.post(urls.post.updateRelatedField, updateData, getHeaders());
const publishInstances = publishData => axios.post(urls.post.publishInstances, publishData, getHeaders());

// DELETE requests
const instances = ({ ids, modelLabel }) =>
  axios.delete(urls.delete.instances, { data: { modelLabel, ids }, ...getHeaders() });

// Search GET request
const searchRelatedFields = searchParameters =>
  axios.get(buildUrl(urls.search.relatedFields, searchParameters), getHeaders());

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
    updateMediaField,
    updateMediaOrder,
    updateRelatedField,
    publishInstances,
  },
  delete: {
    instances,
  },
  search: {
    relatedFields: searchRelatedFields,
  },
};

export default workshopService;
