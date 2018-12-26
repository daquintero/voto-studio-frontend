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
    updateRelatedField: `${workshopApiUrl}/update_related_field/`,
  },
  delete: {
  },
};

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};

// Add auth headers to ALL api requests
const api = axios.create({
  headers: { Authorization: `Token ${user.token}` },
});

// GET requests
const list = () => api.get(urls.get.list);
const build = (appName, modelName, id) => api.get(`${urls.get.build}${appName}/${modelName}/${id}/`);
const relatedFields = (appName, modelName) => api.get(`${urls.get.relatedFields}${appName}/${modelName}/`);
// POST requests
const updateRelatedField = updateData => api.post(urls.post.updateRelatedField, { ...updateData });

const workshopService = {
  get: {
    list,
    build,
    relatedFields,
  },
  post: {
    updateRelatedField,
  },
  delete: {
  },
};

export default workshopService;
