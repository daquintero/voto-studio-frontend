import { initializeActions, actionResult } from '../helpers/asyncHelpers';
import {
  GET_FILE_LIST,
  TOGGLE_FILE_UPLOADER,
  UPLOAD_FILES,
  TOGGLE_FILE_EDITOR,
  UPDATE_FILE,
  DELETE_FILES,
  SELECT_FILE,
  SELECT_TAB,
} from '../actionCreators/mediaActionCreators';

const initialState = {
  files: {
    fileUploaderOpen: false,
    fileEditorOpen: false,
    instances: [],
    selected: [],
    activeTab: 'media.Image',
  },
  videos: {
    instances: [],
  },
  resources: {
    instances: [],
  },
  actions: initializeActions([
    'GET_FILE_LIST',
    'UPLOAD_FILES',
    'UPDATE_FILE',
  ]),
};


export default (state = initialState, action) => {
  switch (action.type) {
    // List Images reducers ----------------------------
    case GET_FILE_LIST.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_FILE_LIST.REQUEST'),
        },
      };
    case GET_FILE_LIST.SUCCESS:
      return {
        ...state,
        files: {
          ...state.files,
          ...action.response,
        },
        actions: {
          ...state.actions,
          ...actionResult('GET_FILE_LIST.SUCCESS'),
        },
      };
    case GET_FILE_LIST.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_FILE_LIST.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Toggle Image Uploader reducer -------------------
    case SELECT_FILE:
      return {
        ...state,
        files: {
          ...state.files,
          selected: action.selected,
        },
      };
      // -----------------------------------------------

    // Toggle Image Uploader reducer -------------------
    case SELECT_TAB:
      return {
        ...state,
        files: {
          ...state.files,
          activeTab: action.activeTab,
        },
      };
      // -----------------------------------------------

    // Toggle Image Uploader reducer -------------------
    case TOGGLE_FILE_UPLOADER:
      return {
        ...state,
        files: {
          ...state.files,
          fileUploaderOpen: !state.files.fileUploaderOpen,
        },
      };
      // -----------------------------------------------

    // Upload Images reducers --------------------------
    case UPLOAD_FILES.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPLOAD_FILES.REQUEST'),
        },
      };
    case UPLOAD_FILES.SUCCESS: {
      const { instances, instanceCount } = action.response;
      let newInstances;

      if (instanceCount < state.files.pageSize) {
        newInstances = [
          ...instances,
          ...state.files.instances,
        ];
      } else {
        newInstances = [
          ...instances,
          ...state.files.instances.slice(0, state.files.instances.length - instances.length),
        ];
      }

      return {
        ...state,
        files: {
          ...state.files,
          instances: newInstances,
          fileCount: action.response.fileCount,
        },
        actions: {
          ...state.actions,
          ...actionResult('UPLOAD_FILES.SUCCESS'),
        },
      };
    }
    case UPLOAD_FILES.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPLOAD_FILES.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Toggle Image Editor reducer ---------------------
    case TOGGLE_FILE_EDITOR:
      return {
        ...state,
        files: {
          ...state.files,
          fileEditorOpen: !state.files.fileEditorOpen,
        },
      };
      // -----------------------------------------------

    // Update Images reducers --------------------------
    case UPDATE_FILE.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_FILE.REQUEST'),
        },
      };
    case UPDATE_FILE.SUCCESS:
      return {
        ...state,
        files: {
          ...state.files,
          instances: state.files.instances
            .map(f => (f.id === action.response.instance.id ? action.response.instance : f)),
        },
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_FILE.SUCCESS'),
        },
      };
    case UPDATE_FILE.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_FILE.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Update Images reducers --------------------------
    case DELETE_FILES.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('DELETE_FILES.REQUEST'),
        },
      };
    case DELETE_FILES.SUCCESS:
      return {
        ...state,
        files: {
          ...state.files,
          instances: state.files.instances.filter(f => !action.response.ids.includes(f.id)),
          fileCount: action.response.fileCount,
        },
        actions: {
          ...state.actions,
          ...actionResult('DELETE_FILES.SUCCESS'),
        },
      };
    case DELETE_FILES.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('DELETE_FILES.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------
    default:
      return state;
  }
};
