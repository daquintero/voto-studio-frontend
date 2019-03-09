import {
  LIST_ITEMS,
  GET_ITEM_DETAIL,
  DELETE_INSTANCES,
  BUILD_FORM,
  UPDATE_BASIC_FIELDS,
  UPDATE_MEDIA_FIELD,
  UPDATE_MEDIA_ORDER,
  UPDATE_RELATED_FIELD,
  PUBLISH_INSTANCES,
  BUILD_FINDER,
  SELECT_INSTANCE_TYPE,
  GET_INSTANCE_LIST,
  GET_LOCATION_PICKER_DATA_SET,
  TOGGLE_LOCATION_PICKER,
  SELECT_POSITION,
  SAVE_POSITION,
  TOGGLE_MEDIA_CENTER,
  TOGGLE_RELATED_CONTENT_FINDER,
} from '../actionCreators/workshopActionCreators';
import { initializeActions, actionResult, actionResultUnnamed } from '../helpers/asyncHelpers';

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
    'UPDATE_BASIC_FIELDS',
    'UPDATE_MEDIA_FIELD',
    'UPDATE_RELATED_FIELD',
    'PUBLISH_INSTANCES',
    'BUILD_FINDER',
    'GET_INSTANCE_LIST',
    'GET_LOCATION_PICKER_DATA_SET',
    'SUBMIT_FOR_REVIEW',
  ]),
  openList: {
    instances: [],
  },
  finder: {
    items: [],
    filter: {
      itemOptions: [],
      currentItemOption: undefined,
      userOptions: [],
      currentUserOption: undefined,
    },
    built: false,
  },
  locationPicker: locationPickerDefault,
  mediaCenter: {
    open: false,
  },
  relatedContentFinder: {
    open: false,
  },
};

export default (state = initialState, action) => {
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
    case DELETE_INSTANCES.INIT:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...initializeActions(['DELETE_INSTANCES']),
        },
      };
    case DELETE_INSTANCES.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('DELETE_INSTANCES.REQUEST'),
        },
      };
    case DELETE_INSTANCES.SUCCESS:
      return {
        ...state,
        openList: {
          ...state.openList,
          instances: state.openList.instances.filter(f => !action.response.ids.includes(f.id)),
        },
        actions: {
          ...state.actions,
          ...actionResult('DELETE_INSTANCES.SUCCESS'),
        },
      };
    case DELETE_INSTANCES.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('DELETE_INSTANCES.ERROR', { error: action.error }),
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
          new: false,
          parentModel: {
            ...state.form.parentModel,
            id: action.response.id,
          },
        },
        openList: {
          ...state.openList,
          instances: [
            action.response.instance,
            ...state.openList.instances,
          ],
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

    // Toggle Media Center reducer ---------------------
    case TOGGLE_MEDIA_CENTER:
      return {
        ...state,
        mediaCenter: {
          ...state.mediaCenter,
          open: !state.mediaCenter.open,
        },
      };

    // Update Media Relationships reducers -------------
    case UPDATE_MEDIA_FIELD.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_MEDIA_FIELD.REQUEST'),
        },
      };
    case UPDATE_MEDIA_FIELD.SUCCESS: {
      const {
        updateType, mediaIds, mediaType, newInstances,
      } = action.response;
      let mediaFields;

      if (updateType === 'add') {
        mediaFields = {
          ...state.form.mediaFields,
          [mediaType]: [...state.form.mediaFields[mediaType], ...newInstances],
        };
      }

      if (updateType === 'remove') {
        mediaFields = {
          ...state.form.mediaFields,
          [mediaType]: state.form.mediaFields[mediaType].filter(f => !mediaIds.includes(f.id)),
        };
      }

      return {
        ...state,
        form: {
          ...state.form,
          mediaFields,
        },
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_MEDIA_FIELD.SUCCESS'),
        },
      };
    }
    case UPDATE_MEDIA_FIELD.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_MEDIA_FIELD.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Update Images reducers --------------------------
    case UPDATE_MEDIA_ORDER.REQUEST: {
      const { mediaType, result } = action.orderData;
      const newMedia = state.form.mediaFields[mediaType];
      const media = state.form.mediaFields[mediaType].filter(f => f.id === parseInt(result.draggableId, 10))[0];
      newMedia.splice(result.source.index, 1);
      newMedia.splice(result.destination.index, 0, media);
      return {
        ...state,
        form: {
          ...state.form,
          mediaFields: {
            ...state.form.mediaFields,
            [mediaType]: newMedia,
          },
        },
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_MEDIA_ORDER.REQUEST'),
        },
      };
    }
    case UPDATE_MEDIA_ORDER.SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          mediaFields: {
            ...state.form.mediaFields,
            [action.response.mediaType]: state.form.mediaFields[action.response.mediaType]
              .sort((a, b) => action.response.order.indexOf(a.id) - action.response.order.indexOf(b.id)),
          },
        },
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_MEDIA_ORDER.SUCCESS'),
        },
      };
    case UPDATE_MEDIA_ORDER.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('UPDATE_MEDIA_ORDER.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Update Related Fields reducers ------------------
    case UPDATE_RELATED_FIELD.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          UPDATE_RELATED_FIELD: {
            ...actionResultUnnamed('UPDATE_RELATED_FIELD.REQUEST', { relLevel: action.relLevel }),
            ...actionResult('UPDATE_RELATED_FIELD.REQUEST', { id: action.id }),
          },
        },
      };
    case UPDATE_RELATED_FIELD.SUCCESS: {
      const { response } = action;
      const index = state.form.relatedFields.map(f => f.modelLabel).indexOf(response.relatedField.modelLabel);

      if (action.response.type === 'add') {
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
                    ...response.relatedField.instances,
                  ],
                },
              },
              ...state.form.relatedFields.slice(index + 1),
            ],
          },
          openList: {
            ...state.openList,
            instances: state.openList.instances.filter(f => !response.relatedField.relatedIds.includes(f.id)),
          },
          actions: {
            ...state.actions,
            UPDATE_RELATED_FIELD: {
              ...actionResultUnnamed('UPDATE_RELATED_FIELD.SUCCESS'),
              ...actionResult('UPDATE_RELATED_FIELD.SUCCESS', { id: action.id }),
            },
          },
        };
      }

      if (action.response.type === 'remove') {
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
                    .filter(f => !response.relatedField.relatedIds.includes(f.id)),
                },
              },
              ...state.form.relatedFields.slice(index + 1),
            ],
          },
          actions: {
            ...state.actions,
            UPDATE_RELATED_FIELD: {
              ...actionResultUnnamed('UPDATE_RELATED_FIELD.SUCCESS'),
              ...actionResult('UPDATE_RELATED_FIELD.SUCCESS', { id: action.id }),
            },
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
          UPDATE_RELATED_FIELD: {
            ...actionResultUnnamed('UPDATE_RELATED_FIELD.ERROR'),
            ...actionResult('UPDATE_RELATED_FIELD.ERROR', { error: action.error, id: action.id }),
          },
        },
      };
      // -----------------------------------------------

    // Publish content reducers ------------------------
    case PUBLISH_INSTANCES.INIT:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...initializeActions(['PUBLISH_INSTANCES']),
        },
      };
    case PUBLISH_INSTANCES.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('PUBLISH_INSTANCES.REQUEST'),
        },
      };
    case PUBLISH_INSTANCES.SUCCESS:
      return {
        ...state,
        openList: {
          ...state.openList,
          instances: state.openList.instances.map((f) => {
            if (action.response.ids.includes(f.id)) {
              return {
                ...f,
                published: true,
              };
            }
            return f;
          }),
        },
        actions: {
          ...state.actions,
          ...actionResult('PUBLISH_INSTANCES.SUCCESS'),
        },
      };
    case PUBLISH_INSTANCES.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('PUBLISH_INSTANCES.ERROR', { error: action.error }),
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
        finder: {
          ...action.finder,
          built: true,
        },
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
    case SELECT_INSTANCE_TYPE:
      return {
        ...state,
        finder: {
          ...state.finder,
          filter: {
            ...state.finder.filter,
            ...action.filter,
          },
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
        openList: { ...action.response.list, count: action.response.count },
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
};
