import {
  LOGIN_USER,
  REGISTER_USER,
  LIST_USERS,
  USER_DETAIL,
  GET_USER_STATISTICS,
  GET_USER_PERMISSIONS,
  UPDATE_USER_PERMISSION,
} from '../actionCreators/userActionCreators';
import userService from '../../services/userService';

const setStorageAndRedirect = (response, history) => {
  const userData = JSON.stringify(response.data.user);
  localStorage.setItem('user', userData);
  history.push('/');
};

export const getUserList = searchTerm => (dispatch) => {
  dispatch({
    type: LIST_USERS.REQUEST,
  });
  return userService.get.list(searchTerm).then(
    response =>
      dispatch({
        type: LIST_USERS.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: LIST_USERS.ERROR,
        error,
      }),
  );
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

export const getUserPermissions = permissionData => (dispatch) => {
  dispatch({
    type: GET_USER_PERMISSIONS,
  });
  return userService.get.userPermissions(permissionData).then(
    response =>
      dispatch({
        type: GET_USER_PERMISSIONS.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: GET_USER_PERMISSIONS.ERROR,
        error,
      }),
  );
};

export const updateUserPermission = permissionData => (dispatch) => {
  dispatch({
    type: UPDATE_USER_PERMISSION.REQUEST,
  });
  return userService.post.updateUserPermission(permissionData).then(
    response =>
      dispatch({
        type: UPDATE_USER_PERMISSION.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: UPDATE_USER_PERMISSION.ERROR,
        error,
      }),
  );
};
