import {
  CREATE_TOUR,
  TOGGLE_NEW_TOUR_MODAL,
} from '../actions/tourActions';


const initialState = {
  tours: [],
  newTour: {},
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
        tours: [
          ...state.tours,
          ...state.newTour,
        ],
      };
    default:
      return state;
  }
}
