import {
  BUILD_FINDER,
  GET_INSTANCE_LIST,
  BUILD_FORM,
  GET_LOCATION_PICKER_DATA_SET,
  UPDATE_BASIC_FIELDS,
  UPDATE_MEDIA_FIELD,
  UPDATE_MEDIA_ORDER,
  UPDATE_RELATED_FIELD,
  DELETE_INSTANCES,
  PUBLISH_INSTANCES,
} from '../actionCreators/workshopActionCreators';
import workshopService from '../../services/workshopService';


// Delete instances of a given model label. Can delete
// either a single instance or many instances.
export const deleteInstances = deleteData => (dispatch) => {
  dispatch({
    type: DELETE_INSTANCES.REQUEST,
  });
  return workshopService.delete.instances(deleteData).then(
    response =>
      dispatch({
        type: DELETE_INSTANCES.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: DELETE_INSTANCES.ERROR,
        error,
      }),
  );
};


// Retrieve all data necessarily data to build the form
// for a given model label.
export const buildForm = queryStringValues => (dispatch) => {
  dispatch({
    type: BUILD_FORM.REQUEST,
  });
  return workshopService.get.build(queryStringValues).then(
    response =>
      dispatch({
        type: BUILD_FORM.SUCCESS,
        form: response.data,
      }),
    error =>
      dispatch({
        type: BUILD_FORM.ERROR,
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
        response: response.data,
      }),
    error =>
      dispatch({
        type: UPDATE_BASIC_FIELDS.ERROR,
        error,
      }),
  );
};

export const updateMediaField = updateData => (dispatch) => {
  dispatch({
    type: UPDATE_MEDIA_FIELD.REQUEST,
  });
  return workshopService.post.updateMediaField(updateData).then(
    response =>
      dispatch({
        type: UPDATE_MEDIA_FIELD.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: UPDATE_MEDIA_FIELD.ERROR,
        error,
      }),
  );
};

export const updateMediaOrder = orderData => (dispatch) => {
  dispatch({
    type: UPDATE_MEDIA_ORDER.REQUEST,
    orderData,
  });
  return workshopService.post.updateMediaOrder(orderData).then(
    response =>
      dispatch({
        type: UPDATE_MEDIA_ORDER.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: UPDATE_MEDIA_ORDER.ERROR,
        error,
      }),
  );
};

export const updateRelatedField = updateData => (dispatch) => {
  dispatch({
    type: UPDATE_RELATED_FIELD.REQUEST,
    id: updateData.fieldName,
    relLevel: updateData.relLevel,
  });
  return workshopService.post.updateRelatedField(updateData).then(
    response =>
      dispatch({
        type: UPDATE_RELATED_FIELD.SUCCESS,
        response: response.data,
        id: response.data.fieldName,
      }),
    error =>
      dispatch({
        type: UPDATE_RELATED_FIELD.ERROR,
        error,
      }),
  );
};

export const publishInstances = publishData => (dispatch) => {
  dispatch({
    type: PUBLISH_INSTANCES.REQUEST,
  });
  return workshopService.post.publishInstances(publishData).then(
    response =>
      dispatch({
        type: PUBLISH_INSTANCES.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: PUBLISH_INSTANCES.ERROR,
        error,
      }),
  );
};

export const buildFinder = () => (dispatch) => {
  dispatch({
    type: BUILD_FINDER.REQUEST,
  });
  return workshopService.get.buildFinder().then(
    response =>
      dispatch({
        type: BUILD_FINDER.SUCCESS,
        finder: response.data.finder,
      }),
    error =>
      dispatch({
        type: BUILD_FINDER.ERROR,
        error,
      }),
  );
};

export const getInstanceList = listData => (dispatch) => {
  dispatch({
    type: GET_INSTANCE_LIST.REQUEST,
  });
  return workshopService.get.instanceList(listData).then(
    response =>
      dispatch({
        type: GET_INSTANCE_LIST.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: GET_INSTANCE_LIST.ERROR,
        error,
      }),
  );
};

export const getRelatedInstanceList = listData => (dispatch) => {
  dispatch({
    type: GET_INSTANCE_LIST.REQUEST,
  });
  return workshopService.get.relatedInstanceList(listData).then(
    response =>
      dispatch({
        type: GET_INSTANCE_LIST.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: GET_INSTANCE_LIST.ERROR,
        error,
      }),
  );
};

export const getLocationPickerDataSet = requestData => (dispatch) => {
  dispatch({
    type: GET_LOCATION_PICKER_DATA_SET.REQUEST,
  });
  return workshopService.get.locationPickerDataSet(requestData).then(
    response =>
      dispatch({
        type: GET_LOCATION_PICKER_DATA_SET.SUCCESS,
        response: response.data,
      }),
    error =>
      dispatch({
        type: GET_LOCATION_PICKER_DATA_SET.ERROR,
        error,
      }),
  );
};
