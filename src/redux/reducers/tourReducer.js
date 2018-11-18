import {
  PUSH_NEW_TOUR,
  CREATE_TOUR,
  TOGGLE_NEW_TOUR_MODAL,
  CREATE_TOUR_STEP,
} from '../actions/tourActions';


const initialState = {
  tours: [],
  newTour: {
    name: '',
    steps: [],
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
    case PUSH_NEW_TOUR:
      return {
        ...state,
        tours: [
          ...state.tours,
          ...state.newTour,
        ],
      };
    default:
      return state;
  }
}
