import axios from 'axios';

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

const getUser = () => (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {});

const getAuthorizationHeaders = () => ({
  headers: {
    Authorization: `Token ${getUser().token}`,
  },
});

// GET requests
const detail = id => axios.get(`${urls.get.detail}${id}/`, getAuthorizationHeaders());
const statistics = id => axios.get(`${urls.get.statistics}${id}/`, getAuthorizationHeaders());
// POST requests
const login = values => axios.post(urls.post.login, { ...values });
const register = values => axios.post(urls.post.register, { ...values });

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
