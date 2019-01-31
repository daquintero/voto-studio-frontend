import {
  LIST_ITEMS,
  GET_ITEM_DETAIL,
  DELETE_ITEM,
  BUILD_FORM,
  GET_RELATED_FIELDS,
  UPDATE_RELATED_FIELD,
  PUBLISH_WORKSHOP_CONTENT,
} from '../actionCreators/workshopActionCreators';
import { initializeActions, actionResult } from '../helpers/asyncHelpers';

const initialState = {
  form: {},
  items: [],
  actions: initializeActions([
    'LIST_ITEMS',
    'GET_ITEM_DETAIL',
    'DELETE_ITEM',
    'BUILD_FORM',
    'GET_RELATED_FIELDS',
    'UPDATE_RELATED_FIELD',
    'PUBLISH_WORKSHOP_CONTENT',
  ]),
};

export default function (state = initialState, action) {
  switch (action.type) {
    // List items reducers -----------------------------
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

    // Get detail reducers -----------------------------
    case GET_ITEM_DETAIL.INIT:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...initializeActions(['GET_ITEM_DETAIL']),
        },
      };
    case GET_ITEM_DETAIL.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_ITEM_DETAIL.REQUEST'),
        },
      };
    case GET_ITEM_DETAIL.SUCCESS:
      return {
        ...state,
        openItem: action.item,
        actions: {
          ...state.actions,
          ...actionResult('GET_ITEM_DETAIL.SUCCESS'),
        },
      };
    case GET_ITEM_DETAIL.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_ITEM_DETAIL.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Get detail reducers -----------------------------
    case DELETE_ITEM.INIT:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...initializeActions(['DELETE_ITEM']),
        },
      };
    case DELETE_ITEM.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('DELETE_ITEM.REQUEST'),
        },
      };
    case DELETE_ITEM.SUCCESS:
      return {
        ...state,
        items: [
          ...state.items.slice(0, action.index),
          {
            ...state.items[action.index],
            values: state.items[action.index].values.filter(o => o.tableValues.id !== action.item.id),
          },
          ...state.items.slice(action.index + 1),
        ],
        actions: {
          ...state.actions,
          ...actionResult('DELETE_ITEM.SUCCESS'),
        },
      };
    case DELETE_ITEM.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('DELETE_ITEM.ERROR', { error: action.error }),
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
          relatedFieldOptions: action.relatedFieldOptions,
          tableHeads: action.tableHeads,
          verboseName: action.verboseName,
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
    case UPDATE_RELATED_FIELD.SUCCESS: {
      if (action.result.type === 'add') {
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
                  action.result.relatedField,
                ],
              },
              ...state.form.relatedFields.slice(action.relatedIndex + 1),
            ],
            relatedFieldOptions: state.form.relatedFieldOptions
              .filter(f => f.id !== action.result.relatedField.tableValues.id),
          },
          actions: {
            ...state.actions,
            ...actionResult('UPDATE_RELATED_FIELD.SUCCESS'),
          },
        };
      }
      if (action.result.type === 'remove') {
        console.log(action);
        return {
          ...state,
          form: {
            ...state.form,
            relatedFields: [
              ...state.form.relatedFields.slice(0, action.relatedIndex),
              {
                ...state.form.relatedFields[action.relatedIndex],
                relatedInstances: state.form.relatedFields[action.relatedIndex].relatedInstances
                  .filter(f => f.tableValues.id !== action.result.relatedId),
              },
              ...state.form.relatedFields.slice(action.relatedIndex + 1),
            ],
          },
          actions: {
            ...state.actions,
            ...actionResult('UPDATE_RELATED_FIELD.SUCCESS'),
          },
        };
      }
      return state;
    }
    case UPDATE_RELATED_FIELD.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_RELATED_FIELD.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Publish content reducers ------------------------
    case PUBLISH_WORKSHOP_CONTENT.INIT:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...initializeActions(['PUBLISH_WORKSHOP_CONTENT']),
        },
      };
    case PUBLISH_WORKSHOP_CONTENT.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('PUBLISH_WORKSHOP_CONTENT.REQUEST'),
        },
      };
    case PUBLISH_WORKSHOP_CONTENT.SUCCESS:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('PUBLISH_WORKSHOP_CONTENT.SUCCESS'),
        },
      };
    case PUBLISH_WORKSHOP_CONTENT.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('PUBLISH_WORKSHOP_CONTENT.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------
    default:
      return state;
  }
}
