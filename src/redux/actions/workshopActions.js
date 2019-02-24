import {
  LIST_ITEMS,
  GET_ITEM_DETAIL,
  DELETE_ITEM,
  BUILD_FORM,
  UPDATE_BASIC_FIELDS,
  UPDATE_MEDIA_FIELD,
  UPDATE_MEDIA_ORDER,
  UPDATE_RELATED_FIELD,
  PUBLISH_WORKSHOP_CONTENT,
  BUILD_FINDER,
  GET_INSTANCE_LIST,
  GET_LOCATION_PICKER_DATA_SET,
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

export const getItemDetail = (appLabel, modelName, id) => (dispatch) => {
  dispatch({
    type: GET_ITEM_DETAIL.REQUEST,
  });
  return workshopService.get.detail(appLabel, modelName, id).then(
    response =>
      dispatch({
        type: GET_ITEM_DETAIL.SUCCESS,
        item: response.data.item,
      }),
    (error) => {
      if (error.response.status === 403) {
        dispatch({
          type: GET_ITEM_DETAIL.DENIED,
          response: error.response.data,
        });
      } else {
        dispatch({
          type: GET_ITEM_DETAIL.ERROR,
          error,
        });
      }
    },
  );
};

export const deleteItem = ({
  appLabel, modelName, id, index,
}) => (dispatch) => {
  dispatch({
    type: DELETE_ITEM.REQUEST,
  });
  return workshopService.delete.item(appLabel, modelName, id).then(
    response =>
      dispatch({
        type: DELETE_ITEM.SUCCESS,
        item: response.data.item,
        index: parseInt(index, 10),
      }),
    error =>
      dispatch({
        type: DELETE_ITEM.ERROR,
        error,
      }),
  );
};

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

export const publishWorkshopContent = publishData => (dispatch) => {
  dispatch({
    type: PUBLISH_WORKSHOP_CONTENT.REQUEST,
  });
  return workshopService.post.publishInstances(publishData).then(
    response =>
      dispatch({
        type: PUBLISH_WORKSHOP_CONTENT.SUCCESS,
        result: response.data.result,
      }),
    error =>
      dispatch({
        type: PUBLISH_WORKSHOP_CONTENT.ERROR,
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

export const getLocationPickerDataSet = () => (dispatch) => {
  dispatch({
    type: GET_LOCATION_PICKER_DATA_SET.REQUEST,
  });
  return workshopService.get.locationPickerDataSet().then(
    response =>
      dispatch({
        type: GET_LOCATION_PICKER_DATA_SET.SUCCESS,
        dataSet: response.data.dataSet,
        locationIdName: response.data.locationIdName,
      }),
    error =>
      dispatch({
        type: GET_LOCATION_PICKER_DATA_SET.ERROR,
        error,
      }),
  );
};
