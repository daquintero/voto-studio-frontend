import { initializeActions, actionResult } from '../helpers/asyncHelpers';
import {
  GET_IMAGE_LIST,
  TOGGLE_IMAGE_UPLOADER,
  UPLOAD_IMAGES,
  TOGGLE_IMAGE_EDITOR,
  UPDATE_IMAGE,
  DELETE_IMAGES,
} from '../actionCreators/mediaActionCreators';

const initialState = {
  images: {
    imageUploaderOpen: false,
    imageEditorOpen: false,
    instances: [],
  },
  videos: {
    instances: [],
  },
  resources: {
    instances: [],
  },
  actions: initializeActions([
    'GET_IMAGE_LIST',
    'UPLOAD_IMAGES',
    'UPDATE_IMAGE',
  ]),
};


export default (state = initialState, action) => {
  switch (action.type) {
    // List Images reducers ----------------------------
    case GET_IMAGE_LIST.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_IMAGE_LIST.REQUEST'),
        },
      };
    case GET_IMAGE_LIST.SUCCESS:
      return {
        ...state,
        images: action.response,
        actions: {
          ...state.actions,
          ...actionResult('GET_IMAGE_LIST.SUCCESS'),
        },
      };
    case GET_IMAGE_LIST.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_IMAGE_LIST.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Toggle Image Uploader reducer -------------------
    case TOGGLE_IMAGE_UPLOADER:
      return {
        ...state,
        images: {
          ...state.images,
          imageUploaderOpen: !state.images.imageUploaderOpen,
        },
      };
      // -----------------------------------------------

    // Upload Images reducers --------------------------
    case UPLOAD_IMAGES.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPLOAD_IMAGES.REQUEST'),
        },
      };
    case UPLOAD_IMAGES.SUCCESS:
      return {
        ...state,
        images: {
          ...state.images,
          instances: [
            ...action.response.instances,
            ...state.images.instances.slice(action.response.instances.length),
          ],
          imageCount: action.response.imageCount,
        },
        actions: {
          ...state.actions,
          ...actionResult('UPLOAD_IMAGES.SUCCESS'),
        },
      };
    case UPLOAD_IMAGES.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPLOAD_IMAGES.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Toggle Image Editor reducer ---------------------
    case TOGGLE_IMAGE_EDITOR:
      return {
        ...state,
        images: {
          ...state.images,
          imageEditorOpen: !state.images.imageEditorOpen,
        },
      };
      // -----------------------------------------------

    // Update Images reducers --------------------------
    case UPDATE_IMAGE.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_IMAGE.REQUEST'),
        },
      };
    case UPDATE_IMAGE.SUCCESS:
      return {
        ...state,
        images: {
          ...state.images,
          instances: state.images.instances
            .map(f => (f.id === action.response.instance.id ? action.response.instance : f)),
        },
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_IMAGE.SUCCESS'),
        },
      };
    case UPDATE_IMAGE.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_IMAGE.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Update Images reducers --------------------------
    case DELETE_IMAGES.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('DELETE_IMAGES.REQUEST'),
        },
      };
    case DELETE_IMAGES.SUCCESS:
      return {
        ...state,
        images: {
          ...state.images,
          instances: state.images.instances.filter(f => !action.response.ids.includes(f.id)),
          imageCount: action.response.imageCount,
        },
        actions: {
          ...state.actions,
          ...actionResult('DELETE_IMAGES.SUCCESS'),
        },
      };
    case DELETE_IMAGES.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('DELETE_IMAGES.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    default:
      return state;
  }
};
