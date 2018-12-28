import axios from 'axios';
import { normalize, schema } from 'normalizr';

const baseUrl = process.env.REACT_APP_BASE_URL;
const tourApiUrl = `${baseUrl}/tours/api/v1`;

const urls = {
  get: {
    list: `${tourApiUrl}/list/`,
    detail: `${tourApiUrl}/detail/`,
    publish: `${tourApiUrl}/publish_tour/`,
  },
  post: {
    createTour: `${tourApiUrl}/create_tour/`,
    updateTour: `${tourApiUrl}/update_tour/`,
    createStep: `${tourApiUrl}/create_step/`,
    updateStep: `${tourApiUrl}/update_step/`,
    updateStepDataSet: `${tourApiUrl}/update_step_data_set/`,
    reorderTourSteps: `${tourApiUrl}/reorder_tour_steps/`,
    createMarker: `${tourApiUrl}/create_marker/`,
    updateMarker: `${tourApiUrl}/update_marker/`,
  },
  delete: {
    deleteTour: `${tourApiUrl}/delete_tour/`,
    deleteStep: `${tourApiUrl}/delete_step/`,
  },
};

const getUser = () => (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});

const getHeaders = () => ({
  headers: {
    Authorization: `Token ${getUser().token}`,
  },
});

// Tour GET requests
const list = () => axios.get(urls.get.list, getHeaders());
const detail = tourId => axios.get(`${urls.get.detail}${tourId}/`, getHeaders());
const publish = tourId => axios.get(`${urls.get.publish}${tourId}/`, getHeaders());
// Tour POST requests
const createTour = tour => axios.post(urls.post.createTour, { tour }, getHeaders());
const updateTour = tour => axios.post(urls.post.updateTour, { tour }, getHeaders());
const createStep = (step, tourId) => axios.post(urls.post.createStep, { step, tourId }, getHeaders());
const updateStep = step => axios.post(urls.post.updateStep, { step }, getHeaders());
const updateStepDataSet = (dataSetId, stepId) =>
  axios.post(urls.post.updateStepDataSet, { dataSetId, stepId }, getHeaders());
const reorderTourSteps = (tourId, result) => axios.post(urls.post.reorderTourSteps, { tourId, result }, getHeaders());
const createMarker = (marker, stepId) => axios.post(urls.post.createMarker, { marker, stepId }, getHeaders());
const updateMarker = marker => axios.post(urls.post.updateMarker, { marker }, getHeaders());
// Tour DELETE requests (The body of a delete request must have the "data" key)
const deleteTour = id => axios.delete(urls.delete.deleteTour, { data: { id } }, getHeaders());
const deleteStep = (stepId, tourId) => axios.delete(urls.delete.deleteStep, { data: { stepId, tourId } }, getHeaders());

const markerSchema = new schema.Entity('markers');
const stepSchema = new schema.Entity('steps', {
  markers: [markerSchema],
});
const tourSchema = new schema.Entity('tour', {
  steps: [stepSchema],
});

const normalizeTours = tours => normalize(tours, [tourSchema]);
const normalizeTour = tour => normalize(tour, tourSchema);

const tourService = {
  get: {
    list,
    detail,
    publish,
  },
  post: {
    createTour,
    updateTour,
    createStep,
    updateStep,
    updateStepDataSet,
    reorderTourSteps,
    createMarker,
    updateMarker,
  },
  delete: {
    deleteTour,
    deleteStep,
  },
  normalize: {
    tours: normalizeTours,
    tour: normalizeTour,
  },
};

export default tourService;
