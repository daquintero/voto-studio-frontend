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

// Add auth headers to ALL api requests
const api = axios.create({
  headers: { Authorization: `Token ${localStorage.getItem('userToken')}` },
});

// Tour GET requests
const list = () => api.get(urls.get.list);
const detail = tourId => api.get(`${urls.get.detail}${tourId}/`);
const publish = tourId => api.get(`${urls.get.publish}${tourId}/`);
// Tour POST requests
const createTour = tour => api.post(urls.post.createTour, { tour });
const updateTour = tour => api.post(urls.post.updateTour, { tour });
const createStep = (step, tourId) => api.post(urls.post.createStep, { step, tourId });
const updateStep = step => api.post(urls.post.updateStep, { step });
const updateStepDataSet = (dataSetId, stepId) => api.post(urls.post.updateStepDataSet, { dataSetId, stepId });
const reorderTourSteps = (tourId, result) => api.post(urls.post.reorderTourSteps, { tourId, result });
const createMarker = (marker, stepId) => api.post(urls.post.createMarker, { marker, stepId });
const updateMarker = marker => api.post(urls.post.updateMarker, { marker });
// Tour DELETE requests (The body of a delete request must have the "data" key)
const deleteTour = id => api.delete(urls.delete.deleteTour, { data: { id } });
const deleteStep = (stepId, tourId) => api.delete(urls.delete.deleteStep, { data: { stepId, tourId } });

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
