import dataSuiteService from '../../services/dataSuiteService';
import {
  LIST_DATA_SETS,
  CREATE_DATA_SET,
  GET_DATA_SET_DETAIL,
  HIGHLIGHT_FEATURE,
  OPEN_FEATURE,
  GET_FEATURE_DETAIL,
} from '../actionCreators/dataSuiteActionCreators';

export const getDataSetList = () => (dispatch) => {
  dispatch({
    type: LIST_DATA_SETS.REQUEST,
  });
  return dataSuiteService.get.list().then(
    response =>
      dispatch({
        type: LIST_DATA_SETS.SUCCESS,
        dataSets: response.data.data_sets,
      }),
    error =>
      dispatch({
        type: LIST_DATA_SETS.ERROR,
        error,
      }),
  );
};

export const createDataSet = newDataSet => (dispatch) => {
  dispatch({
    type: CREATE_DATA_SET.REQUEST,
  });
  return dataSuiteService.post.createDataSet(newDataSet).then(
    response =>
      dispatch({
        type: CREATE_DATA_SET.SUCCESS,
        newDataSet: response.data,
      }),
    error =>
      dispatch({
        type: CREATE_DATA_SET.ERROR,
        error,
      }),
  );
};

export const getDataSetDetail = dataSetId => (dispatch) => {
  dispatch({
    type: GET_DATA_SET_DETAIL.REQUEST,
  });
  return dataSuiteService.get.detail(dataSetId).then(
    response =>
      dispatch({
        type: GET_DATA_SET_DETAIL.SUCCESS,
        dataSet: response.data.data_set,
      }),
    error =>
      dispatch({
        type: GET_DATA_SET_DETAIL.ERROR,
        error,
      }),
  );
};

export const getFeatureDetail = featureId => (dispatch) => {
  dispatch({
    type: GET_FEATURE_DETAIL.REQUEST,
  });
  return dataSuiteService.get.featureDetail(featureId).then(
    response =>
      dispatch({
        type: GET_FEATURE_DETAIL.SUCCESS,
        feature: response.data.feature,
      }),
    error =>
      dispatch({
        type: GET_FEATURE_DETAIL.ERROR,
        error,
      }),
  );
};

export const highlightFeature = featureId => ({
  type: HIGHLIGHT_FEATURE,
  featureId,
});

export const openFeature = featureId => ({
  type: OPEN_FEATURE,
  featureId,
});
