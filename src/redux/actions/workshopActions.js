import {
  LIST_ITEMS,
  GET_ITEM_DETAIL,
  DELETE_ITEM,
  BUILD_FORM,
  GET_RELATED_FIELDS,
  UPDATE_BASIC_FIELDS,
  UPDATE_RELATED_FIELDS,
  SEARCH_RELATED_FIELDS,
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
    error =>
      dispatch({
        type: GET_ITEM_DETAIL.ERROR,
        error,
      }),
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
        relatedFieldInstances: response.data.relatedFieldInstances,
        tableHeads: response.data.tableHeads,
        verboseName: response.data.verboseName,
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
        result: response.data.result,
      }),
    error =>
      dispatch({
        type: UPDATE_BASIC_FIELDS.ERROR,
        error,
      }),
  );
};

export const updateRelatedFields = updateData => (dispatch) => {
  dispatch({
    type: UPDATE_RELATED_FIELDS.REQUEST,
  });
  return workshopService.post.updateRelatedFields(updateData).then(
    response =>
      dispatch({
        type: UPDATE_RELATED_FIELDS.SUCCESS,
        result: response.data.result,
      }),
    error =>
      dispatch({
        type: UPDATE_RELATED_FIELDS.ERROR,
        error,
      }),
  );
};

export const searchRelatedFields = searchParameters => (dispatch) => {
  dispatch({
    type: SEARCH_RELATED_FIELDS.REQUEST,
  });
  return workshopService.search.relatedFields(searchParameters).then(
    response =>
      dispatch({
        type: SEARCH_RELATED_FIELDS.SUCCESS,
        results: response.data.results,
      }),
    error =>
      dispatch({
        type: SEARCH_RELATED_FIELDS.ERROR,
        error,
      }),
  );
};

export const publishWorkshopContent = () => (dispatch) => {
  dispatch({
    type: PUBLISH_WORKSHOP_CONTENT.REQUEST,
  });
  return workshopService.post.publish().then(
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

export const getInstanceList = modelLabel => (dispatch) => {
  dispatch({
    type: GET_INSTANCE_LIST.REQUEST,
  });
  return workshopService.get.instanceList(modelLabel).then(
    response =>
      dispatch({
        type: GET_INSTANCE_LIST.SUCCESS,
        list: response.data.list,
      }),
    error =>
      dispatch({
        type: GET_INSTANCE_LIST.ERROR,
        error,
      }),
  );
};

export const getRelatedInstanceList = (relatedModelLabel, modelLabel, fieldName, id) => (dispatch) => {
  dispatch({
    type: GET_INSTANCE_LIST.REQUEST,
  });
  return workshopService.get.relatedInstanceList(relatedModelLabel, modelLabel, fieldName, id).then(
    response =>
      dispatch({
        type: GET_INSTANCE_LIST.SUCCESS,
        list: response.data.list,
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
