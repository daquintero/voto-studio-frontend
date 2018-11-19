import {
  PUSH_NEW_TOUR,
  CREATE_TOUR,
  TOGGLE_NEW_TOUR_MODAL,
  CREATE_TOUR_STEP,
  UPDATE_TOUR_STEP,
  DELETE_TOUR_STEP,
} from '../actions/tourActions';


const initialState = {
  tours: [],
  newTour: {
    name: '',
    steps: [],
    activeStep: -1,
  },
  newTourModal: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TOGGLE_NEW_TOUR_MODAL:
      return {
        ...state,
        newTourModal: !state.newTourModal,
      };
    case CREATE_TOUR:
      return {
        ...state,
        newTour: {
          steps: [],
          ...action.newTour,
        },
      };
    case CREATE_TOUR_STEP:
      return {
        ...state,
        newTour: {
          ...state.newTour,
          steps: [
            ...state.newTour.steps,
            action.step,
          ],
        },
      };
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
    case UPDATE_TOUR_STEP:
      return {
        ...state,
        newTour: {
          ...state.newTour,
          steps: [
            ...state.newTour.steps.slice(0, action.index),
            action.updatedTourStep,
            ...state.newTour.steps.slice(action.index + 1),
          ],
        },
      };
    case PUSH_NEW_TOUR:
      return {
        ...state,
        tours: [
          ...state.tours,
          state.newTour,
        ],
      };
    default:
      return state;
  }
}
