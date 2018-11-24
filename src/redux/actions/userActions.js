import axios from 'axios';

export const AUTHENTICATED_USER = 'AUTHENTICATED_USER';
export const UNAUTHENTICATED_USER = 'UNAUTHENTICATED_USER';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

const baseUrl = process.env.REACT_APP_BASE_URL;
console.log(process.env);

const urls = {
  login: `${baseUrl}/users/api/v1/login/`,
  register: `${baseUrl}/users/api/v1/register/`,
};

export function loginUser(email, password, history) {
  return async (dispatch) => {
    try {
      const response = await axios.post(urls.login, { email, password });
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
