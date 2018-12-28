import {
  LIST_ITEMS,
  BUILD_FORM,
  GET_RELATED_FIELDS,
  UPDATE_RELATED_FIELD,
} from '../actionCreators/workshopActionCreators';
import { initializeActions, actionResult } from '../helpers/asyncHelpers';

const initialState = {
  form: {},
  items: [],
  actions: initializeActions([
    'LIST_ITEMS',
    'BUILD_FORM',
    'GET_RELATED_FIELDS',
    'UPDATE_RELATED_FIELD',
  ]),
};

export default function (state = initialState, action) {
  switch (action.type) {
    // Build form reducers -----------------------------
    case LIST_ITEMS.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LIST_ITEMS.REQUEST'),
        },
      };
    case LIST_ITEMS.SUCCESS:
      return {
        ...state,
        items: action.items,
        actions: {
          ...state.actions,
          ...actionResult('LIST_ITEMS.SUCCESS'),
        },
      };
    case LIST_ITEMS.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LIST_ITEMS.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Build form reducers -----------------------------
    case BUILD_FORM.INIT:
      return {
        ...state,
        form: {},
        actions: {
          ...state.actions,
          ...initializeActions(['BUILD_FORM']),
        },
      };
    case BUILD_FORM.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('BUILD_FORM.REQUEST'),
        },
      };
    case BUILD_FORM.SUCCESS:
      return {
        ...state,
        form: action.form,
        actions: {
          ...state.actions,
          ...actionResult('BUILD_FORM.SUCCESS'),
        },
      };
    case BUILD_FORM.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('BUILD_FORM.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Build form reducers -----------------------------
    case GET_RELATED_FIELDS.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_RELATED_FIELDS.REQUEST'),
        },
      };
    case GET_RELATED_FIELDS.SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          relatedFieldOptions: action.relatedFields, // TODO: confusing key here
        },
        actions: {
          ...state.actions,
          ...actionResult('GET_RELATED_FIELDS.SUCCESS'),
        },
      };
    case GET_RELATED_FIELDS.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_RELATED_FIELDS.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Build form reducers -----------------------------
    case UPDATE_RELATED_FIELD.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_RELATED_FIELD.REQUEST'),
        },
      };
    case UPDATE_RELATED_FIELD.SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          relatedFields: [
            ...state.form.relatedFields.slice(0, action.relatedIndex),
            {
              ...state.form.relatedFields[action.relatedIndex],
              relatedInstances: [
                ...state.form.relatedFields[action.relatedIndex].relatedInstances,
                action.updates.relatedField,
              ],
            },
            ...state.form.relatedFields.slice(action.relatedIndex + 1),
          ],
          relatedFieldOptions: [],
        },
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_RELATED_FIELD.SUCCESS'),
        },
      };
    case UPDATE_RELATED_FIELD.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_RELATED_FIELD.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------
    default:
      return state;
  }
}
