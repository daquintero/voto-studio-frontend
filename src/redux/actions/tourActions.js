export const TOGGLE_NEW_TOUR_MODAL = 'TOGGLE_NEW_TOUR_MODAL';
export const CREATE_TOUR = 'CREATE_TOUR';
export const OPEN_TOUR = 'OPEN_TOUR';
export const CREATE_TOUR_STEP = 'CREATE_TOUR_STEP';
export const DELETE_TOUR_STEP = 'DELETE_TOUR_STEP';
export const UPDATE_TOUR_STEP = 'UPDATE_TOUR_STEP';
export const REORDER_TOUR_STEPS = 'REORDER_TOUR_STEPS';
export const CREATE_MARKER = 'CREATE_MARKER';
export const DELETE_MARKER = 'DELETE_MARKER';
export const UPDATE_MARKER = 'UPDATE_MARKER';
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

export function openTour(tour) {
  return {
    type: OPEN_TOUR,
    tour,
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

export function reorderTourSteps(step, result) {
  return {
    type: REORDER_TOUR_STEPS,
    step,
    result,
  };
}

export function createMarker(newMarker, step, stepIndex) {
  return {
    type: CREATE_MARKER,
    newMarker,
    step,
    stepIndex,
  };
}

export function deleteMarker(id, step, stepIndex) {
  return {
    type: DELETE_MARKER,
    id,
    step,
    stepIndex,
  };
}

export function updateMarker(newMarker, step, stepIndex) {
  return {
    type: UPDATE_MARKER,
    newMarker,
    step,
    stepIndex,
  };
}

export function pushNewTour() {
  return {
    type: PUSH_NEW_TOUR,
  };
}
