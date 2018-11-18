export const TOGGLE_NEW_TOUR_MODAL = 'TOGGLE_NEW_TOUR_MODAL';
export const CREATE_TOUR = 'CREATE_TOUR';
export const CREATE_TOUR_STEP = 'CREATE_TOUR_STEP';
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

export function pushNewTour() {
  return {
    type: PUSH_NEW_TOUR,
  };
}
