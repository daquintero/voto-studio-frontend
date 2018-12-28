import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const workshopApiUrl = `${baseUrl}/forms/api/v1`;

const urls = {
  get: {
    list: `${workshopApiUrl}/list/`,
    build: `${workshopApiUrl}/build/`,
    relatedFields: `${workshopApiUrl}/related_fields/`,
  },
  post: {
    updateBasicFields: `${workshopApiUrl}/update_basic_fields/`,
    updateRelatedField: `${workshopApiUrl}/update_related_field/`,
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

// GET requests
const list = () => axios.get(urls.get.list, getHeaders());
const build = ({ appName, modelName, id }) =>
  axios.get(`${urls.get.build}?al=${appName}&mn=${modelName}&id=${id}`, getHeaders());
const relatedFields = ({
  parentAppName, parentModelName, parentId, relatedAppName, relatedModelName, relatedFieldName,
}) =>
  axios.get(
    `${urls.get.relatedFields}?pal=${parentAppName}&pmn=${parentModelName}&pid=${parentId}&ral=${relatedAppName}` +
    `&rmn=${relatedModelName}&rfn=${relatedFieldName}`,
    getHeaders(),
  );
// POST requests
const updateBasicFields = values => axios.post(urls.post.updateBasicFields, { ...values }, getHeaders());
const updateRelatedField = updateData => axios.post(urls.post.updateRelatedField, { ...updateData }, getHeaders());

const workshopService = {
  get: {
    list,
    build,
    relatedFields,
  },
  post: {
    updateBasicFields,
    updateRelatedField,
  },
  delete: {
  },
};

export default workshopService;
