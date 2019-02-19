import {
  LOGIN_USER,
  REGISTER_USER,
  LIST_USERS,
  USER_DETAIL,
  GET_USER_STATISTICS,
  GET_USER_PERMISSIONS,
  UPDATE_USER_PERMISSION,
} from '../actionCreators/userActionCreators';
import { initializeActions, actionResult } from '../helpers/asyncHelpers';

const initialState = {
  authenticated: false,
  permittedUsers: [],
  userList: [],
  actions: initializeActions([
    'LOGIN_USER',
    'REGISTER_USER',
    'LIST_USERS',
    'USER_DETAIL',
    'GET_USER_STATISTICS',
    'PERMIT_USER',
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

    // Register user reducers --------------------------
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
    case LIST_USERS.INIT:
      return {
        ...state,
        userList: [],
        actions: {
          ...state.actions,
          ...actionResult('LIST_USERS.INIT'),
        },
      };
    case LIST_USERS.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LIST_USERS.REQUEST'),
        },
      };
    case LIST_USERS.SUCCESS:
      return {
        ...state,
        userList: action.response.users.filter(f => !state.permittedUsers.map(g => g.id).includes(f.id)),
        actions: {
          ...state.actions,
          ...actionResult('LIST_USERS.SUCCESS'),
        },
      };
    case LIST_USERS.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LIST_USERS.ERROR'),
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

    // User detail reducers ----------------------------
    case GET_USER_PERMISSIONS.INIT:
      return {
        ...state,
        permittedUsers: [],
        permissionsDict: {},
        actions: {
          ...state.actions,
          ...actionResult('GET_USER_PERMISSIONS.INIT'),
        },
      };
    case GET_USER_PERMISSIONS.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_USER_PERMISSIONS.REQUEST'),
        },
      };
    case GET_USER_PERMISSIONS.SUCCESS:
      return {
        ...state,
        ...action.response,
        actions: {
          ...state.actions,
          ...actionResult('GET_USER_PERMISSIONS.SUCCESS', { error: action.error }),
        },
      };
    case GET_USER_PERMISSIONS.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_USER_PERMISSIONS.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // User detail reducers ----------------------------
    case UPDATE_USER_PERMISSION.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_USER_PERMISSION.REQUEST'),
        },
      };
    case UPDATE_USER_PERMISSION.SUCCESS: {
      const id = parseInt(action.response.id, 10);
      if (action.response.updateType === 'permit') {
        return {
          ...state,
          ...action.response,
          userList: state.userList.filter(f => f.id !== id),
          permittedUsers: [
            ...state.permittedUsers,
            state.userList.filter(f => f.id === id)[0],
          ],
          actions: {
            ...state.actions,
            ...actionResult('UPDATE_USER_PERMISSION.SUCCESS'),
          },
        };
      }
      if (action.response.updateType === 'revoke') {
        return {
          ...state,
          userList: [
            ...state.userList,
            state.permittedUsers.filter(f => f.id === id)[0],
          ],
          permittedUsers: state.permittedUsers.filter(f => f.id !== id),
          actions: {
            ...state.actions,
            ...actionResult('UPDATE_USER_PERMISSION.SUCCESS'),
          },
        };
      }
      return state;
    }
    case UPDATE_USER_PERMISSION.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_USER_PERMISSION.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------
    default:
      return state;
  }
}
