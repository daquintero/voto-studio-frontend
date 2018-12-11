import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
const userApiUrl = `${baseUrl}/users/api/v1`;

const urls = {
  post: {
    login: `${userApiUrl}/login/`,
    register: `${userApiUrl}/register/`,
  },
};

const login = values => axios.post(urls.post.login, { ...values });
const register = values => axios.post(urls.post.register, { ...values });

const userService = {
  post: {
    login,
    register,
  },
};

export default userService;
