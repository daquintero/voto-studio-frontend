import axios from 'axios';
import { normalize, schema } from 'normalizr';

const baseUrl = process.env.REACT_APP_BASE_URL;

const urls = {
  list: `${baseUrl}/tours/api/v1/list/`,
};

// Add auth headers to ALL api requests
const api = axios.create({
  headers: { Authorization: `Token ${localStorage.getItem('user')}` },
});

const list = () => api.get(urls.list);

const normaliseTours = (tours) => {
  const marker = new schema.Entity('markers');
  const step = new schema.Entity('steps', {
    markers: [marker],
  });
  const tour = new schema.Entity('tour', {
    steps: [step],
  });
  return normalize(tours, [tour]);
};

const tourService = {
  list,
  normalise: {
    tours: normaliseTours,
  },
};

export default tourService;
