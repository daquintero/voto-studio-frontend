import mediaService from '../../services/mediaService';
import {
  GET_FILE_LIST,
  UPLOAD_FILES,
  UPDATE_FILE,
  DELETE_FILES,
} from '../actionCreators/mediaActionCreators';


export const getFileList = requestData => (dispatch) => {
  dispatch({
    type: GET_FILE_LIST.REQUEST,
  });
  return mediaService.get.files(requestData).then(
    response =>
      dispatch({
        type: GET_FILE_LIST.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: GET_FILE_LIST.ERROR,
        error,
      }),
  );
};

export const uploadFiles = uploadData => (dispatch) => {
  dispatch({
    type: UPLOAD_FILES.REQUEST,
  });
  return mediaService.post.files(uploadData).then(
    response =>
      dispatch({
        type: UPLOAD_FILES.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: UPLOAD_FILES.ERROR,
        error,
      }),
  );
};

export const updateFile = updateData => (dispatch) => {
  dispatch({
    type: UPDATE_FILE.REQUEST,
  });
  return mediaService.post.updateFile(updateData).then(
    response =>
      dispatch({
        type: UPDATE_FILE.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: UPDATE_FILE.ERROR,
        error,
      }),
  );
};

export const deleteFiles = deleteData => (dispatch) => {
  dispatch({
    type: DELETE_FILES.REQUEST,
  });
  return mediaService.delete.files(deleteData).then(
    response =>
      dispatch({
        type: DELETE_FILES.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: DELETE_FILES.ERROR,
        error,
      }),
  );
};
