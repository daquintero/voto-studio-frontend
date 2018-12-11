import {
  LOGIN_USER,
  REGISTER_USER,
} from '../actionCreators/userActionCreators';
import { initializeActions, actionResult } from '../helpers/asyncHelpers';

const initialState = {
  authenticated: false,
  actions: initializeActions([
    'LOGIN_USER',
    'REGISTER_USER',
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
        email: action.email,
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
        email: action.email,
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
    default:
      return state;
  }
}
