import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

const urls = {
  login: `${baseUrl}/users/api/v1/login/`,
  register: `${baseUrl}/users/api/v1/register/`,
};

const login = values => axios.post(urls.login, { ...values });

const register = values => axios.post(urls.register, { ...values });

const userService = {
  login,
  register,
};

export default userService;
