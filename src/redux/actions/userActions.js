import userService from '../../services/userService';

export const AUTHENTICATED_USER = 'AUTHENTICATED_USER';
export const UNAUTHENTICATED_USER = 'UNAUTHENTICATED_USER';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';
export const LOGOUT_USER = 'LOGOUT_USER';

export function loginUser(values, history) {
  return async (dispatch) => {
    try {
      const response = await userService.login(values);
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
      const response = await userService.register(values);
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
