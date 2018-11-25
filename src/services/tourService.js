import axios from 'axios';
import { normalize, schema } from 'normalizr';

const baseUrl = process.env.REACT_APP_BASE_URL;

const urls = {
  list: `${baseUrl}/tours/api/v1/list/`,
  detail: `${baseUrl}/tours/api/v1/detail/`,
};

// Add auth headers to ALL api requests
const api = axios.create({
  headers: { Authorization: `Token ${localStorage.getItem('user')}` },
});

const list = () => api.get(urls.list);

const detail = tourId => api.get(`${urls.detail}${tourId}/`);

const markerSchema = new schema.Entity('markers');
const stepSchema = new schema.Entity('steps', {
  markers: [markerSchema],
});
const tourSchema = new schema.Entity('tour', {
  steps: [stepSchema],
});

const normaliseTours = tours => normalize(tours, [tourSchema]);

const normalisTour = tour => normalize(tour, tourSchema);

const tourService = {
  list,
  detail,
  normalise: {
    tours: normaliseTours,
    tour: normalisTour,
  },
};

export default tourService;
