import {
  LOGIN_USER,
  REGISTER_USER,
  USER_DETAIL,
  GET_USER_STATISTICS,
} from '../actionCreators/userActionCreators';
import { initializeActions, actionResult } from '../helpers/asyncHelpers';

const initialState = {
  authenticated: false,
  actions: initializeActions([
    'LOGIN_USER',
    'REGISTER_USER',
    'USER_DETAIL',
    'GET_USER_STATISTICS',
  ]),
};

export default function (state = initialState, action) {
  switch (action.type) {
    // Login user reducers -----------------------------
    case LOGIN_USER.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LOGIN_USER.REQUEST'),
        },
      };
    case LOGIN_USER.SUCCESS:
      return {
        ...state,
        authenticated: true,
        user: action.user,
        actions: {
          ...state.actions,
          ...actionResult('LOGIN_USER.SUCCESS'),
        },
      };
    case LOGIN_USER.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LOGIN_USER.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Login user reducers -----------------------------
    case REGISTER_USER.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('REGISTER_USER.REQUEST'),
        },
      };
    case REGISTER_USER.SUCCESS:
      return {
        ...state,
        authenticated: true,
        user: action.user,
        actions: {
          ...state.actions,
          ...actionResult('REGISTER_USER.SUCCESS'),
        },
      };
    case REGISTER_USER.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('REGISTER_USER.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // User detail reducers ----------------------------
    case USER_DETAIL.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('USER_DETAIL.REQUEST'),
        },
      };
    case USER_DETAIL.SUCCESS:
      return {
        ...state,
        user: action.user,
        actions: {
          ...state.actions,
          ...actionResult('USER_DETAIL.SUCCESS'),
        },
      };
    case USER_DETAIL.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('USER_DETAIL.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // User detail reducers ----------------------------
    case GET_USER_STATISTICS.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_USER_STATISTICS.REQUEST'),
        },
      };
    case GET_USER_STATISTICS.SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          statistics: action.statistics,
        },
        actions: {
          ...state.actions,
          ...actionResult('GET_USER_STATISTICS.SUCCESS'),
        },
      };
    case GET_USER_STATISTICS.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_USER_STATISTICS.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------
    default:
      return state;
  }
}
