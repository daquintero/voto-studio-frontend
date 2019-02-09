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
    locationPicketDataSet: `${workshopApiUrl}/location_picker/`,
  },
  post: {
    updateBasicFields: `${workshopApiUrl}/update_basic_fields/`,
    updateMediaField: `${workshopApiUrl}/update_media_field/`,
    updateMediaOrder: `${workshopApiUrl}/update_media_order/`,
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

const instanceList = relatedModelLabel =>
  axios.get(buildUrl(urls.get.instanceList, { rml: relatedModelLabel }), getHeaders());

const relatedInstanceList = (relatedModelLabel, modelLabel, fieldName, id) =>
  axios.get(buildUrl(urls.get.instanceList, {
    rml: relatedModelLabel,
    ml: modelLabel,
    fn: fieldName,
    id,
  }), getHeaders());

const locationPickerDataSet = () => axios.get(urls.get.locationPicketDataSet, getHeaders());

// POST requests
const updateBasicFields = updateData => axios.post(urls.post.updateBasicFields, updateData, getHeaders());
const updateMediaField = updateData => axios.post(urls.post.updateMediaField, updateData, getHeaders());
const updateMediaOrder = orderData => axios.post(urls.post.updateMediaOrder, orderData, getHeaders());
const updateRelatedField = updateData => axios.post(urls.post.updateRelatedField, updateData, getHeaders());
const publish = () => axios.post(urls.post.publish, {}, getHeaders());

// DELETE requests
const item = (appLabel, modelName, id) =>
  axios.delete(urls.delete.item, { data: { appLabel, modelName, id }, ...getHeaders() });

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
