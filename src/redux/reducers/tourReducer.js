import {
  LIST_TOURS,
  CREATE_TOUR,
  OPEN_TOUR,
  CREATE_TOUR_STEP,
  DELETE_TOUR_STEP,
  UPDATE_TOUR_STEP,
  REORDER_TOUR_STEPS,
  CHANGE_ACTIVE_TOUR_STEP,
  CREATE_MARKER,
  UPDATE_MARKER,
  DELETE_MARKER,
  CLOSE_OPEN_TOUR,
} from '../actionCreators/tourActionCreators';

// I have moved large explanatory comment that was here to a Slack post

const actionResult = (action, { id = undefined, error = null } = {}) => {
  const [actionName, actionState] = id ? [id, action.split('.')[1]] : action.split('.');
  switch (actionState) {
    case 'REQUEST':
      return { [actionName]: { loading: true, loaded: false, init: false } };
    case 'SUCCESS':
      return { [actionName]: { loading: false, loaded: true, init: false } };
    case 'ERROR':
      return {
        [actionName]: {
          loading: false, loaded: false, init: false, error,
        },
      };
    default:
      return Error('No matching action state provided');
  }
};

const initializeActions = (actions) => {
  const actionsObj = {};
  for (let i = 0; i < actions.length; i += 1) {
    Object.assign(actionsObj, { [actions[i]]: { loading: false, loaded: false, init: true } });
  }
  return actionsObj;
};

const initialState = {
  idCode: 'T',
  loadedTourId: -1,
  tourList: {},
  openTour: {},
  mapDataList: {},
  actions: initializeActions([
    'LIST_TOURS',
    'CREATE_TOUR',
    'OPEN_TOUR',
    'CREATE_TOUR_STEP',
    'DELETE_TOUR_STEP',
    'UPDATE_TOUR_STEP',
    'REORDER_TOUR_STEPS',
    'CHANGE_ACTIVE_TOUR_STEP',
    'CREATE_MARKER',
    'UPDATE_MARKER',
    'DELETE_MARKER',
    'LIST_DATA',
  ]),
};

export default function (state = initialState, action) {
  switch (action.type) {
    // List tours reducers -----------------------------
    case LIST_TOURS.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LIST_TOURS.REQUEST'),
        },
      };
    case LIST_TOURS.SUCCESS:
      return {
        ...state,
        tourList: {
          tours: action.tourList,
        },
        actions: {
          ...state.actions,
          ...actionResult('LIST_TOURS.SUCCESS'),
        },
      };
    case LIST_TOURS.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('LIST_TOURS.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Create tour reducers ----------------------------
    case CREATE_TOUR.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('CREATE_TOUR.REQUEST'),
        },
      };
    case CREATE_TOUR.SUCCESS:
      return {
        ...state,
        tourList: {
          ...state.tourList,
          tours: [
            ...state.tourList.tours,
            action.newTour,
          ],
        },
        actions: {
          ...state.actions,
          ...actionResult('CREATE_TOUR.SUCCESS'),
        },
      };
    case CREATE_TOUR.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('CREATE_TOUR.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Open tour reducers ------------------------------
    case OPEN_TOUR.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('OPEN_TOUR.REQUEST'),
        },
      };
    case OPEN_TOUR.SUCCESS: {
      const activeTourStepId = action.tour.steps.length ? action.tour.steps[0].id : -1;
      return {
        ...state,
        openTour: {
          ...action.tour,
          activeTourStepId,
        },
        actions: {
          ...state.actions,
          ...actionResult('OPEN_TOUR.SUCCESS'),
        },
      };
    }
    case OPEN_TOUR.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('OPEN_TOUR.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Create tour step reducers -----------------------
    case CREATE_TOUR_STEP.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('CREATE_TOUR_STEP.REQUEST'),
        },
      };
    case CREATE_TOUR_STEP.SUCCESS:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          activeTourStepId: action.newTourStep.id,
          steps: [
            ...state.openTour.steps,
            {
              ...action.newTourStep,
              width: 'calc(100% - 290px)', // Override the width and height settings
              height: 'calc(100vh - 55px)',
            },
          ],
        },
        actions: {
          ...state.actions,
          ...actionResult('CREATE_TOUR_STEP.SUCCESS'),
        },
      };
    case CREATE_TOUR_STEP.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('CREATE_TOUR_STEP.ERROR', { error: action.error }),
        },
      };
      // -----------------------------------------------

    // Delete tour step reducers -----------------------
    case DELETE_TOUR_STEP.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          DELETE_TOUR_STEP: {
            ...state.actions.DELETE_TOUR_STEP,
            ...actionResult('DELETE_TOUR_STEP.REQUEST', { id: action.id }),
          },
        },
      };
    case DELETE_TOUR_STEP.SUCCESS:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: state.openTour.steps.filter(step => step.id !== action.id),
          activeTourStepId: state.openTour.activeTourStepId === action.id ? -1 : state.openTour.activeTourStepId,
        },
        actions: {
          ...state.actions,
          DELETE_TOUR_STEP: {
            ...state.actions.DELETE_TOUR_STEP,
            ...actionResult('DELETE_TOUR_STEP.SUCCESS', { id: action.id }),
          },
        },
      };
    case DELETE_TOUR_STEP.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          DELETE_TOUR_STEP: {
            ...state.actions.DELETE_TOUR_STEP,
            ...actionResult('DELETE_TOUR_STEP.ERROR', { id: action.id, error: action.error }),
          },
        },
      };
      // -----------------------------------------------

    // Update tour step reducers -----------------------
    case UPDATE_TOUR_STEP.REQUEST:
      return {
        ...state,
        actions: {
          ...state.actions,
          UPDATE_TOUR_STEP: {
            ...state.actions.UPDATE_TOUR_STEP,
            ...actionResult('UPDATE_TOUR_STEP.REQUEST', { id: action.id }),
          },
        },
      };
    case UPDATE_TOUR_STEP.SUCCESS:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: [
            ...state.openTour.steps.slice(0, action.index),
            action.updatedTourStep,
            ...state.openTour.steps.slice(action.index + 1),
          ],
        },
        actions: {
          ...state.actions,
          UPDATE_TOUR_STEP: {
            ...state.actions.UPDATE_TOUR_STEP,
            ...actionResult('UPDATE_TOUR_STEP.SUCCESS', { id: action.id }),
          },
        },
      };
    case UPDATE_TOUR_STEP.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          UPDATE_TOUR_STEP: {
            ...state.actions.UPDATE_TOUR_STEP,
            ...actionResult('UPDATE_TOUR_STEP.ERROR', { id: action.id, error: action.error }),
          },
        },
      };
      // -----------------------------------------------

    // Reorder tour steps reducer ----------------------
    // This case is interesting. The update of the order must be done in the REQUEST state otherwise the
    // steps would jump back to their original order until the server responded and then they would jump
    // back to their new order. The SUCCESS state can be used to give the user some visual feedback that
    // new order has been persisted.
    case REORDER_TOUR_STEPS.REQUEST: {
      const newSteps = state.openTour.steps;
      const step = state.openTour.steps.filter(s => s.id === parseInt(action.result.draggableId, 10))[0];
      newSteps.splice(action.result.source.index, 1);
      newSteps.splice(action.result.destination.index, 0, step);
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: newSteps,
        },
        actions: {
          ...state.actions,
          ...actionResult('REORDER_TOUR_STEPS.REQUEST'),
        },
      };
    }
    case REORDER_TOUR_STEPS.SUCCESS:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('REORDER_TOUR_STEPS.SUCCESS'),
        },
      };
    case REORDER_TOUR_STEPS.ERROR:
      return {
        ...state,
        actions: {
          ...state.actions,
          ...actionResult('REORDER_TOUR_STEPS.ERROR', { error: action.error }),
        },
      };

    // Change active tour step reducer -----------------
    // (this is synchronous)
    case CHANGE_ACTIVE_TOUR_STEP:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          activeTourStepId: action.id,
        },
      };
      // -----------------------------------------------

    // Create marker reducers --------------------------
    case CREATE_MARKER:
      return {
        ...state,
        newTour: {
          ...state.newTour,
          steps: [
            ...state.newTour.steps.slice(0, action.stepIndex),
            {
              ...action.step,
              markers: [
                ...action.step.markers,
                action.newMarker,
              ],
            },
            ...state.newTour.steps.slice(action.stepIndex + 1),
          ],
        },
      };
    case UPDATE_MARKER:
      return {
        ...state,
        newTour: {
          ...state.newTour,
          steps: [
            ...state.newTour.steps.slice(0, action.stepIndex),
            {
              ...action.step,
              markers: [
                ...action.step.markers.slice(0, action.newMarkerIndex),
                action.newMarker,
                ...action.step.markers.slice(action.newMarkerIndex + 1),
              ],
            },
            ...state.newTour.steps.slice(action.stepIndex + 1),
          ],
        },
      };
    case DELETE_MARKER:
      return {
        ...state,
        newTour: {
          ...state.newTour,
          steps: [
            ...state.newTour.steps.slice(0, action.stepIndex),
            {
              ...action.step,
              markers: action.step.markers.filter(marker => marker.id !== action.marker.id),
            },
            ...state.newTour.steps.slice(action.stepIndex + 1),
          ],
        },
      };
    case CLOSE_OPEN_TOUR:
      return {
        ...state,
        actions: {
          ...state.actions,
          OPEN_TOUR: initializeActions(['OPEN_TOUR']),
        },
      };
    default:
      return state;
  }
}
