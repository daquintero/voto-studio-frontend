import {
  AUTHENTICATED_USER,
  UNAUTHENTICATED_USER,
  AUTHENTICATION_ERROR,
} from '../actions/userActions';

const initialState = {
  authenticated: false,
  error: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATED_USER:
      return {
        ...state,
        authenticated: true,
      };
    case UNAUTHENTICATED_USER:
      return {
        ...state,
        authenticated: false,
      };
    case AUTHENTICATION_ERROR:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
