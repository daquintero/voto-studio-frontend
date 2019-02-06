import mediaService from '../../services/mediaService';
import {
  GET_IMAGE_LIST,
  UPLOAD_IMAGES,
  UPDATE_IMAGE,
} from '../actionCreators/mediaActionCreators';


export const getImageList = pageNumber => (dispatch) => {
  dispatch({
    type: GET_IMAGE_LIST.REQUEST,
  });
  return mediaService.get.images(pageNumber).then(
    response =>
      dispatch({
        type: GET_IMAGE_LIST.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: GET_IMAGE_LIST.ERROR,
        error,
      }),
  );
};

export const uploadImages = uploadData => (dispatch) => {
  dispatch({
    type: UPLOAD_IMAGES.REQUEST,
  });
  return mediaService.post.images(uploadData).then(
    response =>
      dispatch({
        type: UPLOAD_IMAGES.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: UPLOAD_IMAGES.ERROR,
        error,
      }),
  );
};

export const updateImage = updateData => (dispatch) => {
  dispatch({
    type: UPDATE_IMAGE.REQUEST,
  });
  return mediaService.post.updateImage(updateData).then(
    response =>
      dispatch({
        type: UPDATE_IMAGE.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: UPDATE_IMAGE.ERROR,
        error,
      }),
  );
};
