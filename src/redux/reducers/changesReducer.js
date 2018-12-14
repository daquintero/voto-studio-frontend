import {
  LIST_CHANGES,
  COMMIT_CHANGES,
} from '../actionCreators/changesActionCreators';
import { initializeActions, actionResult } from '../helpers/asyncHelpers';

const initialState = {
  idCode: 'C',
  staged: [],
  committed: [],
  reverted: [],
  actions: initializeActions([
    'LIST_CHANGES',
  ]),
};

export default (state = initialState, action) => {
  switch (action.type) {
    // List changes reducers ---------------------------
    case LIST_CHANGES.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LIST_CHANGES.REQUEST'),
        },
      };
    case LIST_CHANGES.SUCCESS:
      return {
        ...state,
        staged: action.changes,
        actions: {
          ...state.actions,
          ...actionResult('LIST_CHANGES.SUCCESS'),
        },
      };
    case LIST_CHANGES.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LIST_CHANGES.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // List changes reducers ---------------------------
    case COMMIT_CHANGES.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('COMMIT_CHANGES.REQUEST', { ids: action.ids }),
        },
      };
    case COMMIT_CHANGES.SUCCESS:
      return {
        ...state,
        staged: state.staged.filter(c => action.ids.indexOf(c.id) === -1),
        committed: [
          ...state.committed,
          ...action.changes,
        ],
        actions: {
          ...state.actions,
          ...actionResult('COMMIT_CHANGES.SUCCESS', { ids: action.ids }),
        },
      };
    case COMMIT_CHANGES.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('COMMIT_CHANGES.ERROR', { ids: action.ids, error: action.error }),
        },
      };
    // -----------------------------------------------
    default:
      return state;
  }
};
