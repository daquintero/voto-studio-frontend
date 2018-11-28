import axios from 'axios';
import { normalize, schema } from 'normalizr';

const baseUrl = process.env.REACT_APP_BASE_URL;
const tourApiUrl = `${baseUrl}/tours/api/v1`;

const urls = {
  get: {
    list: `${tourApiUrl}/list/`,
    detail: `${tourApiUrl}/detail/`,
  },
  post: {
    createTour: `${tourApiUrl}/create_tour/`,
    updateTour: `${tourApiUrl}/update_tour/`,
    createStep: `${tourApiUrl}/create_step/`,
    updateStep: `${tourApiUrl}/update_step/`,
  },
  delete: {
    deleteStep: `${tourApiUrl}/delete_step/`,
  },
};

// Add auth headers to ALL api requests
const api = axios.create({
  headers: { Authorization: `Token ${localStorage.getItem('user')}` },
});

// Tour GET requests
const list = () => api.get(urls.get.list);
const detail = tourId => api.get(`${urls.get.detail}${tourId}/`);
// Tour POST requests
const createTour = tour => api.post(urls.post.createTour, { tour });
const updateTour = tour => api.post(urls.post.updateTour, { tour });
const createStep = (step, tourId) => api.post(urls.post.createStep, { step, tourId });
const updateStep = step => api.post(urls.post.updateStep, { step });
// Tour DELETE requests (The body of a delete request must have the "data" key)
const deleteStep = stepId => api.delete(urls.delete.deleteStep, { data: { stepId } });

const markerSchema = new schema.Entity('markers');
const stepSchema = new schema.Entity('steps', {
  markers: [markerSchema],
});
const tourSchema = new schema.Entity('tour', {
  steps: [stepSchema],
});

const normaliseTours = tours => normalize(tours, [tourSchema]);
const normaliseTour = tour => normalize(tour, tourSchema);

const tourService = {
  get: {
    list,
    detail,
  },
  post: {
    createTour,
    updateTour,
    createStep,
    updateStep,
  },
  delete: {
    deleteStep,
  },
  normalise: {
    tours: normaliseTours,
    tour: normaliseTour,
  },
};

export default tourService;
