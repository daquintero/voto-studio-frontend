import axios from 'axios';
import buildUrl from '../shared/utils/buildUrl';
import getHeaders from '../shared/utils/getHeaders';

const baseUrl = process.env.REACT_APP_BASE_URL;
const userApiUrl = `${baseUrl}/users/api/v1`;

const urls = {
  get: {
    detail: `${userApiUrl}/detail/full/`,
    email: `${userApiUrl}/detail/email/`,
    statistics: `${userApiUrl}/statistics/`,
  },
  post: {
    login: `${userApiUrl}/login/`,
    register: `${userApiUrl}/register/`,
  },
};

// GET requests
const detail = id => axios.get(buildUrl(urls.get.detail, { id }), getHeaders());
const statistics = id => axios.get(buildUrl(urls.get.statistics, { id }), getHeaders());

// POST requests
const login = values => axios.post(urls.post.login, values);
const register = values => axios.post(urls.post.register, values);

const userService = {
  get: {
    detail,
    statistics,
  },
  post: {
    login,
    register,
  },
};

export default userService;
