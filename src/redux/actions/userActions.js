import axios from 'axios';

export const AUTHENTICATED_USER = 'AUTHENTICATED_USER';
export const UNAUTHENTICATED_USER = 'UNAUTHENTICATED_USER';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';
export const LOGOUT_USER = 'LOGOUT_USER';

const baseUrl = process.env.REACT_APP_BASE_URL;

const urls = {
  login: `${baseUrl}/users/api/v1/login/`,
  register: `${baseUrl}/users/api/v1/register/`,
};

export function loginUser(values, history) {
  return async (dispatch) => {
    try {
      const response = await axios.post(urls.login, { ...values });
      dispatch({
        type: AUTHENTICATED_USER,
      });
      localStorage.setItem('user', response.data.token);
      history.push('/');
    } catch (error) {
      dispatch({
        type: AUTHENTICATION_ERROR,
        error: 'Invalid email or password',
      });
    }
  };
}

export function registerUser(values, history) {
  return async (dispatch) => {
    try {
      const response = await axios.post(urls.register, { ...values });
      dispatch({
        type: AUTHENTICATED_USER,
      });
      localStorage.setItem('user', response.data.token);
      history.push('/');
    } catch (error) {
      dispatch({
        type: AUTHENTICATION_ERROR,
        error: 'Error registering account. Please try again later.',
      });
    }
  };
}
