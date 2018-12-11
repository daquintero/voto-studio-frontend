import {
  LOGIN_USER,
  REGISTER_USER,
} from '../actionCreators/userActionCreators';
import userService from '../../services/userService';

export const loginUser = (values, history) => (dispatch) => {
  dispatch({
    type: LOGIN_USER.REQUEST,
  });
  return userService.post.login(values).then(
    (response) => {
      dispatch({
        type: LOGIN_USER.SUCCESS,
        email: response.data.email,
      });
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userEmail', response.data.email);
      history.push('/');
    },
    error => dispatch({
      type: LOGIN_USER.ERROR,
      error,
    }),
  );
};

export const registerUser = (values, history) => (dispatch) => {
  dispatch({
    type: REGISTER_USER.REQUEST,
  });
  return userService.post.register(values).then(
    (response) => {
      dispatch({
        type: REGISTER_USER.SUCCESS,
        email: response.data.email,
      });
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userEmail', response.data.email);
      history.push('/');
    },
    error => dispatch({
      type: REGISTER_USER.ERROR,
      error,
    }),
  );
};
