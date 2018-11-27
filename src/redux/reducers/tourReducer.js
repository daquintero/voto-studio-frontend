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
} from '../actionCreators/tourActionCreators';


const initialState = { // Remember to update both the tours array and the newTour object!
  idCode: 'T',
  loadedTourId: -1,
  tourList: { loading: true, loaded: false },
  openTour: { loading: false, loaded: false },
  mapDataList: { loading: true },
};

export default function (state = initialState, action) {
  switch (action.type) {
    // List tours reducers
    case LIST_TOURS.REQUEST:
      return {
        ...state,
        tourList: { loading: true, loaded: false },
      };
    case LIST_TOURS.SUCCESS:
      return {
        ...state,
        tourList: {
          loading: false,
          loaded: true,
          tours: action.tourList,
        },
      };
    case LIST_TOURS.ERROR:
      return {
        ...state,
        tourList: { loading: false, loaded: false, error: action.error },
      };

    // Create tour reducers.
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
      };
    case CREATE_TOUR.ERROR:
      return {
        ...state,
        openTour: { error: action.error },
      };

    // Open tour reducers ------------------------------
    case OPEN_TOUR.REQUEST:
      return {
        ...state,
        openTour: {
          loading: true,
          loaded: false,
        },
      };
    case OPEN_TOUR.SUCCESS:
      return {
        ...state,
        openTour: {
          loading: false,
          loaded: true,
          ...action.tour,
          activeTourStepId: action.tour.steps[0].id,
        },
      };
    case OPEN_TOUR.ERROR:
      return {
        ...state,
        openTour: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
      // -----------------------------------------------

    // Create tour step reducers -----------------------
    case CREATE_TOUR_STEP.SUCCESS:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          activeTourStepId: action.newTourStep.id,
          steps: [
            ...state.openTour.steps,
            action.newTourStep,
          ],
        },
      };
    case CREATE_TOUR_STEP.ERROR:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: state.openTour.steps,
          error: action.error,
        },
      };
      // -----------------------------------------------

    // Delete tour step reducers -----------------------
    case DELETE_TOUR_STEP:
      return {
        ...state,
        newTour: {
          ...state.newTour,
          steps: [
            ...state.newTour.steps.filter(step => step.id !== action.id),
          ],
        },
      };
      // -----------------------------------------------

    // Update tour step reducers -----------------------
    case UPDATE_TOUR_STEP.SUCCESS:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: [
            ...state.newTour.steps.slice(0, action.index),
            action.updatedTourStep,
            ...state.newTour.steps.slice(action.index + 1),
          ],
        },
      };

    case UPDATE_TOUR_STEP.ERROR: // Not sure if putting the error there is correct
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: [
            ...state.newTour.steps.slice(0, action.index),
            { error: action.error },
            ...state.newTour.steps.slice(action.index + 1),
          ],
        },
      };
      // -----------------------------------------------

    // Reorder tour steps reducer ----------------------
    case REORDER_TOUR_STEPS: {
      const newSteps = state.newTour.steps;
      newSteps.splice(action.result.source.index, 1);
      newSteps.splice(action.result.destination.index, 0, action.step);
      return {
        ...state,
        newTour: {
          ...state.newTour,
          steps: newSteps,
        },
      };
    }
    case CHANGE_ACTIVE_TOUR_STEP:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          activeTourStepId: action.id,
        },
      };
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
    default:
      return state;
  }
}
