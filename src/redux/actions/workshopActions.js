import {
  LIST_ITEMS,
  BUILD_FORM,
  GET_RELATED_FIELDS,
  UPDATE_BASIC_FIELDS,
  UPDATE_RELATED_FIELD,
} from '../actionCreators/workshopActionCreators';
import workshopService from '../../services/workshopService';

export const listItems = () => (dispatch) => {
  dispatch({
    type: LIST_ITEMS.REQUEST,
  });
  return workshopService.get.list().then(
    response =>
      dispatch({
        type: LIST_ITEMS.SUCCESS,
        items: response.data.items,
      }),
    error =>
      dispatch({
        type: LIST_ITEMS.ERROR,
        error,
      }),
  );
};

export const buildForm = (appLabel, modelName, id) => (dispatch) => {
  dispatch({
    type: BUILD_FORM.REQUEST,
  });
  return workshopService.get.build(appLabel, modelName, id).then(
    response =>
      dispatch({
        type: BUILD_FORM.SUCCESS,
        form: response.data.form,
      }),
    error =>
      dispatch({
        type: BUILD_FORM.ERROR,
        error,
      }),
  );
};

export const getRelatedFields = requestData => (dispatch) => {
  dispatch({
    type: GET_RELATED_FIELDS.REQUEST,
  });
  return workshopService.get.relatedFields(requestData).then(
    response =>
      dispatch({
        type: GET_RELATED_FIELDS.SUCCESS,
        relatedFields: response.data.relatedFields,
      }),
    error =>
      dispatch({
        type: GET_RELATED_FIELDS.ERROR,
        error,
      }),
  );
};

export const updateBasicFields = updateData => (dispatch) => {
  dispatch({
    type: UPDATE_BASIC_FIELDS.REQUEST,
  });
  return workshopService.post.updateBasicFields(updateData).then(
    response =>
      dispatch({
        type: UPDATE_BASIC_FIELDS.SUCCESS,
        updates: response.data.updates,
      }),
    error =>
      dispatch({
        type: UPDATE_BASIC_FIELDS.ERROR,
        error,
      }),
  );
};

export const updateRelatedField = (updateData, relatedIndex) => (dispatch) => {
  dispatch({
    type: UPDATE_RELATED_FIELD.REQUEST,
  });
  return workshopService.post.updateRelatedField(updateData).then(
    response =>
      dispatch({
        type: UPDATE_RELATED_FIELD.SUCCESS,
        updates: response.data.updates,
        relatedIndex,
        fieldName: updateData.fieldName,
      }),
    error =>
      dispatch({
        type: UPDATE_RELATED_FIELD.ERROR,
        error,
      }),
  );
};

export const submitForm = () => {};
