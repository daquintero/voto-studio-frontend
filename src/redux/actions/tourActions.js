import tourService from '../../services/tourService';
import {
  LIST_TOURS,
  CREATE_TOUR,
  OPEN_TOUR,
  CREATE_TOUR_STEP,
  UPDATE_TOUR_STEP,
  REORDER_TOUR_STEPS,
  CHANGE_ACTIVE_TOUR_STEP,
  DELETE_TOUR_STEP,
  CREATE_MARKER,
  UPDATE_MARKER,
  DELETE_MARKER,
} from '../actionCreators/tourActionCreators';


export const getTourList = () => (dispatch) => {
  dispatch({
    type: LIST_TOURS.REQUEST,
  });
  return tourService.get.list().then(
    response => dispatch({
      type: LIST_TOURS.SUCCESS,
      tourList: response.data,
    }),
    error => dispatch({
      type: LIST_TOURS.ERROR,
      error,
    }),
  );
};

export const getTourDetail = tourId => (dispatch) => {
  dispatch({
    type: OPEN_TOUR.REQUEST,
  });
  return tourService.get.detail(tourId).then(
    response =>
      dispatch({
        type: OPEN_TOUR.SUCCESS,
        tour: response.data,
      }),
    error =>
      dispatch({
        type: OPEN_TOUR.ERROR,
        error,
      }),
  );
};

export const createTour = newTourInfo => (dispatch) => {
  dispatch({
    type: CREATE_TOUR.REQUEST,
  });
  return tourService.post.createTour(newTourInfo).then(
    response =>
      dispatch({
        type: CREATE_TOUR.SUCCESS,
        newTour: response.data,
      }),
    error =>
      dispatch({
        type: CREATE_TOUR.ERROR,
        error,
      }),
  );
};


export const createTourStep = (step, tourId) => (dispatch) => {
  dispatch({
    type: CREATE_TOUR_STEP.REQUEST,
  });
  return tourService.post.createStep(step, tourId).then(
    response =>
      dispatch({
        type: CREATE_TOUR_STEP.SUCCESS,
        newTourStep: response.data,
      }),
    error =>
      dispatch({
        type: CREATE_TOUR_STEP.ERROR,
        error,
      }),
  );
};

export const updateTourStep = (updatedTourStep, index) => (dispatch) => {
  dispatch({
    type: UPDATE_TOUR_STEP.REQUEST,
  });
  return tourService.post.updateStep(updatedTourStep, index).then(
    response =>
      dispatch({
        type: UPDATE_TOUR_STEP.SUCCESS,
        updatedTourStep: response.data,
        index,
      }),
    error =>
      dispatch({
        type: UPDATE_TOUR_STEP.ERROR,
        error,
      }),
  );
};

export function deleteTourStep(id) {
  return {
    type: DELETE_TOUR_STEP,
    id,
  };
}

export function reorderTourSteps(step, result) {
  return {
    type: REORDER_TOUR_STEPS,
    step,
    result,
  };
}

export function changeActiveTourStep(id) {
  return {
    type: CHANGE_ACTIVE_TOUR_STEP,
    id,
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
