export const TOGGLE_NEW_TOUR_MODAL = 'TOGGLE_NEW_TOUR_MODAL';
export const CREATE_TOUR = 'CREATE_TOUR';
export const CREATE_TOUR_STEP = 'CREATE_TOUR_STEP';
export const DELETE_TOUR_STEP = 'DELETE_TOUR_STEP';
export const UPDATE_TOUR_STEP = 'UPDATE_TOUR_STEP';
export const PUSH_NEW_TOUR = 'PUSH_NEW_TOUR';

export function toggleNewTourModal() {
  return {
    type: TOGGLE_NEW_TOUR_MODAL,
  };
}

export function createTour(newTour) {
  return {
    type: CREATE_TOUR,
    newTour,
  };
}

export function createTourStep(step) {
  return {
    type: CREATE_TOUR_STEP,
    step,
  };
}

export function deleteTourStep(id) {
  return {
    type: DELETE_TOUR_STEP,
    id,
  };
}

export function updateTourStep(updatedTourStep, index) {
  return {
    type: UPDATE_TOUR_STEP,
    updatedTourStep,
    index,
  };
}

export function pushNewTour() {
  return {
    type: PUSH_NEW_TOUR,
  };
}
