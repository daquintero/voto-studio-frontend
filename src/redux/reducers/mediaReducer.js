import { initializeActions, actionResult } from '../helpers/asyncHelpers';
import {
  GET_IMAGE_LIST,
  TOGGLE_IMAGE_UPLOADER,
  UPLOAD_IMAGES,
  TOGGLE_IMAGE_EDITOR,
  UPDATE_IMAGE,
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
          instances: [
            ...action.response.instances,
            ...state.images.instances.slice(action.response.instances.length),
          ],
          imageCount: action.response.imageCount,
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

    // Toggle Image Uploader reducer -------------------
    case TOGGLE_IMAGE_EDITOR:
      return {
        ...state,
        images: {
          ...state.images,
          imageEditorOpen: !state.images.imageEditorOpen,
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

    default:
      return state;
  }
};
