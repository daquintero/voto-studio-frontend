import {
  LIST_DATA_SETS,
  GET_DATA_SET_DETAIL,
  CREATE_DATA_SET,
  HIGHLIGHT_FEATURE,
  OPEN_FEATURE,
  GET_FEATURE_DETAIL,
  UPDATE_FEATURE_PROPERTIES,
} from '../actionCreators/dataSuiteActionCreators';
import { initializeActions, actionResult } from '../helpers/asyncHelpers';

const initialState = {
  idCode: 'MD',
  openDataSet: { openFeature: { editing: false } },
  actions: initializeActions([
    'LIST_DATA_SETS',
    'CREATE_DATA_SET',
    'GET_DATA_SET_DETAIL',
    'GET_FEATURE_DETAIL',
    'UPDATE_FEATURE',
  ]),
};

export default (state = initialState, action) => {
  switch (action.type) {
    // List data sets reducers -------------------------
    case LIST_DATA_SETS.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LIST_DATA_SETS.REQUEST'),
        },
      };
    case LIST_DATA_SETS.SUCCESS:
      return {
        ...state,
        dataSets: action.dataSets,
        actions: {
          ...state.actions,
          ...actionResult('LIST_DATA_SETS.SUCCESS'),
        },
      };
    case LIST_DATA_SETS.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LIST_DATA_SETS.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // List data sets reducers -------------------------
    case CREATE_DATA_SET.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('CREATE_DATA_SET.REQUEST'),
        },
      };
    case CREATE_DATA_SET.SUCCESS:
      return {
        ...state,
        dataSets: [
          ...state.dataSets,
          action.newDataSet,
        ],
        actions: {
          ...state.actions,
          ...actionResult('CREATE_DATA_SET.SUCCESS'),
        },
      };
    case CREATE_DATA_SET.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('CREATE_DATA_SET.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Get data set detail reducers --------------------
    case GET_DATA_SET_DETAIL.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_DATA_SET_DETAIL.REQUEST'),
        },
      };
    case GET_DATA_SET_DETAIL.SUCCESS:
      return {
        ...state,
        openDataSet: {
          ...state.openDataSet,
          ...action.dataSet,
        },
        actions: {
          ...state.actions,
          ...actionResult('GET_DATA_SET_DETAIL.SUCCESS'),
        },
      };
    case GET_DATA_SET_DETAIL.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_DATA_SET_DETAIL.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Get data set detail reducers --------------------
    case GET_FEATURE_DETAIL.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_FEATURE_DETAIL.REQUEST'),
        },
      };
    case GET_FEATURE_DETAIL.SUCCESS:
      return {
        ...state,
        openDataSet: {
          ...state.openDataSet,
          openFeature: {
            ...action.feature,
            editing: true,
          },
        },
        actions: {
          ...state.actions,
          ...actionResult('GET_FEATURE_DETAIL.SUCCESS'),
        },
      };
    case GET_FEATURE_DETAIL.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_FEATURE_DETAIL.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Highlight feature reducers ----------------------
    case HIGHLIGHT_FEATURE:
      return {
        ...state,
        openDataSet: {
          ...state.openDataSet,
          highlightedFeatureId: action.featureId,
        },
      };
      // -----------------------------------------------

    // Open data set detail reducers -------------------
    case OPEN_FEATURE:
      return {
        ...state,
        openDataSet: {
          ...state.openDataSet,
          openFeature: {
            ...state.openDataSet.data.features.filter(f => f.id === action.featureId)[0],
            editing: true,
          },
        },
      };
      // -----------------------------------------------

    // Get data set detail reducers --------------------
    case UPDATE_FEATURE_PROPERTIES.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_FEATURE_PROPERTIES.REQUEST'),
        },
      };
    case UPDATE_FEATURE_PROPERTIES.SUCCESS:
      return {
        ...state,
        openDataSet: {
          ...state.openDataSet,
          data: {
            ...state.openDataSet.data,
            features: [
              ...state.openDataSet.data.features.slice(0, action.newFeature.index),
              {
                ...action.newFeature,
                properties: action.newFeatureProperties,
              },
              ...state.openDataSet.data.features.slice(action.newFeature.index + 1),
            ],
          },
          openFeature: {
            ...state.openDataSet.openFeature,
            properties: action.newFeatureProperties,
          },
        },
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_FEATURE_PROPERTIES.SUCCESS'),
        },
      };
    case UPDATE_FEATURE_PROPERTIES.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_FEATURE_PROPERTIES.ERROR', { error: action.error }),
        },
      };
    // -----------------------------------------------
    default:
      return state;
  }
};
