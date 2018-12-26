import {
  LOGIN_USER,
  REGISTER_USER,
  USER_DETAIL,
  GET_USER_STATISTICS,
} from '../actionCreators/userActionCreators';
import userService from '../../services/userService';

const setStorageAndRedirect = (response, history) => {
  const userData = JSON.stringify(response.data.user);
  localStorage.setItem('user', userData);
  history.push('/');
};

export const getUserDetail = id => (dispatch) => {
  dispatch({
    type: USER_DETAIL.REQUEST,
  });
  return userService.get.detail(id).then(
    response =>
      dispatch({
        type: USER_DETAIL.SUCCESS,
        user: response.data.user,
      }),
    error =>
      dispatch({
        type: USER_DETAIL.ERROR,
        error,
      }),
  );
};

export const getUserStatistics = id => (dispatch) => {
  dispatch({
    type: GET_USER_STATISTICS.REQUEST,
  });
  return userService.get.statistics(id).then(
    response =>
      dispatch({
        type: GET_USER_STATISTICS.SUCCESS,
        statistics: response.data.statistics,
      }),
    error =>
      dispatch({
        type: GET_USER_STATISTICS.ERROR,
        error,
      }),
  );
};

export const loginUser = (values, history) => (dispatch) => {
  dispatch({
    type: LOGIN_USER.REQUEST,
  });
  return userService.post.login(values).then(
    (response) => {
      dispatch({
        type: LOGIN_USER.SUCCESS,
        user: response.data.user,
      });
      setStorageAndRedirect(response, history);
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
        user: response.data.user,
      });
      setStorageAndRedirect(response, history);
    },
    error => dispatch({
      type: REGISTER_USER.ERROR,
      error,
    }),
  );
};
