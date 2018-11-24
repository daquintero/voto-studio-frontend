import tourService from '../../services/tourService';

export const LIST_TOURS = 'LIST_TOURS';
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

export function getTours() {
  return async (dispatch) => {
    try {
      const response = await tourService.list();
      dispatch({
        type: LIST_TOURS,
        tours: response.data,
      });
    } catch (error) {
      // If errors
    }
  };
}

// Create a new tour. newTourInfo is an object of shape:
// newTourInfo = { name: 'New Tour', desc: 'This is a new tour...' }
export function createTour(newTourInfo) {
  // This would return some form of new ID from the database
  return {
    type: CREATE_TOUR,
    newTourInfo,
  };
}

export function openTour(tourId) {
  return {
    type: OPEN_TOUR,
    tourId,
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

export function deleteMarker(marker, step, stepIndex) {
  return {
    type: DELETE_MARKER,
    marker,
    step,
    stepIndex,
  };
}

export function updateMarker(newMarker, newMarkerIndex, step, stepIndex) {
  return {
    type: UPDATE_MARKER,
    newMarker,
    newMarkerIndex,
    step,
    stepIndex,
  };
}

export function pushNewTour() {
  return {
    type: PUSH_NEW_TOUR,
  };
}
