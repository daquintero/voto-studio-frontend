import {
  LIST_ITEMS,
  GET_ITEM_DETAIL,
  DELETE_ITEM,
  BUILD_FORM,
  GET_RELATED_FIELDS,
  UPDATE_BASIC_FIELDS,
  UPDATE_RELATED_FIELDS,
  PUBLISH_WORKSHOP_CONTENT,
  BUILD_FINDER,
  GET_INSTANCE_LIST,
  GET_LOCATION_PICKER_DATA_SET,
  TOGGLE_LOCATION_PICKER,
  SELECT_POSITION,
  SAVE_POSITION, TOGGLE_RELATED_CONTENT_FINDER,
} from '../actionCreators/workshopActionCreators';
import { initializeActions, actionResult } from '../helpers/asyncHelpers';

const locationPickerDefault = {
  open: false,
  hasSelectedObject: false,
  locationIdName: 'CIRCUITO',
  selectedObject: {
    properties: {},
  },
};

const initialState = {
  form: {},
  items: [],
  actions: initializeActions([
    'LIST_ITEMS',
    'GET_ITEM_DETAIL',
    'DELETE_ITEM',
    'BUILD_FORM',
    'GET_RELATED_FIELDS',
    'UPDATE_RELATED_FIELDS',
    'PUBLISH_WORKSHOP_CONTENT',
    'BUILD_FINDER',
    'GET_INSTANCE_LIST',
    'GET_LOCATION_PICKER_DATA_SET',
  ]),
  openList: {},
  finder: {
    items: [],
    options: [],
  },
  locationPicker: locationPickerDefault,
  relatedContentFinder: {
    open: false,
  },
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

    // Delete Item reducers ----------------------------
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
    case BUILD_FORM.SUCCESS: {
      const { form } = action;
      return {
        ...state,
        form,
        locationPicker: {
          open: false,
          hasSelectedObject: !form.new,
          selectedObject: {
            properties: {
              locationId: form.new ? null : form.defaultValues.locationId,
              [form.defaultValues.locationIdName]: form.new ? null : form.defaultValues.locationId,
            },
          },
        },
        actions: {
          ...state.actions,
          ...actionResult('BUILD_FORM.SUCCESS'),
        },
      };
    }
    case BUILD_FORM.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('BUILD_FORM.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Get Related Fields reducers ---------------------
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
          relatedFieldInstances: action.relatedFieldInstances,
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

    // Update Basic Fields reducers --------------------
    case UPDATE_BASIC_FIELDS.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_BASIC_FIELDS.REQUEST'),
        },
      };
    case UPDATE_BASIC_FIELDS.SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          new: !action.result.created,
          parentModel: {
            ...state.form.parentModel,
            id: action.result.id,
          },
        },
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_BASIC_FIELDS.SUCCESS'),
        },
      };
    case UPDATE_BASIC_FIELDS.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_BASIC_FIELDS.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Update Related Fields reducers ------------------
    case UPDATE_RELATED_FIELDS.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_RELATED_FIELDS.REQUEST'),
        },
      };
    case UPDATE_RELATED_FIELDS.SUCCESS: {
      const { result } = action;
      const index = state.form.relatedFields.map(f => f.modelLabel).indexOf(result.relatedField.modelLabel);

      if (action.result.type === 'add') {
        return {
          ...state,
          form: {
            ...state.form,
            relatedFields: [
              ...state.form.relatedFields.slice(0, index),
              {
                ...state.form.relatedFields[index],
                relatedInstances: {
                  ...state.form.relatedFields[index].relatedInstances,
                  instances: [
                    ...state.form.relatedFields[index].relatedInstances.instances,
                    ...result.relatedField.instances,
                  ],
                },
              },
              ...state.form.relatedFields.slice(index + 1),
            ],
          },
          openList: {
            ...state.openList,
            instances: state.openList.instances.filter(f => !result.relatedField.relatedIds.includes(f.id)),
          },
          actions: {
            ...state.actions,
            ...actionResult('UPDATE_RELATED_FIELDS.SUCCESS'),
          },
        };
      }

      if (action.result.type === 'remove') {
        return {
          ...state,
          form: {
            ...state.form,
            relatedFields: [
              ...state.form.relatedFields.slice(0, index),
              {
                ...state.form.relatedFields[index],
                relatedInstances: {
                  ...state.form.relatedFields[index].relatedInstances,
                  instances: state.form.relatedFields[index].relatedInstances.instances
                    .filter(f => !result.relatedField.relatedIds.includes(f.id)),
                },
              },
              ...state.form.relatedFields.slice(index + 1),
            ],
          },
          actions: {
            ...state.actions,
            ...actionResult('UPDATE_RELATED_FIELDS.SUCCESS'),
          },
        };
      }
      return state;
    }
    case UPDATE_RELATED_FIELDS.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_RELATED_FIELDS.ERROR', { error: action.error }),
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

    // Build finder reducers ---------------------------
    case BUILD_FINDER.INIT:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...initializeActions(['BUILD_FINDER']),
        },
      };
    case BUILD_FINDER.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('BUILD_FINDER.REQUEST'),
        },
      };
    case BUILD_FINDER.SUCCESS:
      return {
        ...state,
        finder: action.finder,
        actions: {
          ...state.actions,
          ...actionResult('BUILD_FINDER.SUCCESS'),
        },
      };
    case BUILD_FINDER.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('BUILD_FINDER.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Instance list reducers --------------------------
    case GET_INSTANCE_LIST.INIT:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...initializeActions(['GET_INSTANCE_LIST']),
        },
      };
    case GET_INSTANCE_LIST.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_INSTANCE_LIST.REQUEST'),
        },
      };
    case GET_INSTANCE_LIST.SUCCESS:
      return {
        ...state,
        openList: action.list,
        actions: {
          ...state.actions,
          ...actionResult('GET_INSTANCE_LIST.SUCCESS'),
        },
      };
    case GET_INSTANCE_LIST.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_INSTANCE_LIST.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Location Picker Data Set reducers ---------------
    case GET_LOCATION_PICKER_DATA_SET.INIT:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...initializeActions(['GET_LOCATION_PICKER_DATA_SET']),
        },
      };
    case GET_LOCATION_PICKER_DATA_SET.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_LOCATION_PICKER_DATA_SET.REQUEST'),
        },
      };
    case GET_LOCATION_PICKER_DATA_SET.SUCCESS:
      return {
        ...state,
        locationPicker: {
          ...state.locationPicker,
          dataSet: action.dataSet,
          locationIdName: action.locationIdName,
        },
        actions: {
          ...state.actions,
          ...actionResult('GET_LOCATION_PICKER_DATA_SET.SUCCESS'),
        },
      };
    case GET_LOCATION_PICKER_DATA_SET.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('GET_LOCATION_PICKER_DATA_SET.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Toggle Location Picker reducer ------------------
    case TOGGLE_LOCATION_PICKER:
      return {
        ...state,
        locationPicker: {
          ...state.locationPicker,
          open: !state.locationPicker.open,
        },
      };

    // Select Location reducer -------------------------
    case SELECT_POSITION:
      return {
        ...state,
        locationPicker: {
          ...state.locationPicker,
          hasSelectedObject: true,
          selectedObject: action.selectedObject,
        },
      };

    // Save Location reducer ---------------------------
    case SAVE_POSITION:
      return {
        ...state,
        locationPicker: {
          ...state.locationPicker,
          hasSelectedObject: true,
          selectedObject: action.selectedObject,
        },
      };

    // Toggle Related Content Finder reducer -----------
    case TOGGLE_RELATED_CONTENT_FINDER:
      return {
        ...state,
        relatedContentFinder: {
          ...state.relatedContentFinder,
          open: !state.relatedContentFinder.open,
        },
      };

    default:
      return state;
  }
}
