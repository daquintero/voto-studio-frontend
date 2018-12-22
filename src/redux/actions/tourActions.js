import tourService from '../../services/tourService';
import {
  LIST_TOURS,
  CREATE_TOUR,
  OPEN_TOUR,
  DELETE_TOUR,
  CREATE_TOUR_STEP,
  UPDATE_TOUR_STEP,
  UPDATE_TOUR_STEP_DATA_SET,
  REORDER_TOUR_STEPS,
  CHANGE_ACTIVE_TOUR_STEP,
  DELETE_TOUR_STEP,
  CREATE_MARKER,
  UPDATE_MARKER,
  UPDATE_MARKER_POSITION,
  DELETE_MARKER,
  TOGGLE_PREVIEW_TOUR_MODE,
  CLOSE_OPEN_TOUR,
  PUBLISH_TOUR,
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

export const deleteTour = id => (dispatch) => {
  dispatch({
    type: DELETE_TOUR.REQUEST,
    id,
  });
  return tourService.delete.deleteTour(id).then(
    response =>
      dispatch({
        type: DELETE_TOUR.SUCCESS,
        id: response.data.id,
      }),
    error =>
      dispatch({
        type: DELETE_TOUR.ERROR,
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
    id: updatedTourStep.id,
  });
  return tourService.post.updateStep(updatedTourStep, index).then(
    response =>
      dispatch({
        type: UPDATE_TOUR_STEP.SUCCESS,
        id: updatedTourStep.id,
        updatedTourStep: response.data,
        index,
      }),
    error =>
      dispatch({
        type: UPDATE_TOUR_STEP.ERROR,
        id: updatedTourStep.id,
        error,
      }),
  );
};

export const updateTourStepDataSet = (newDataSetId, updatedStepId, index) => (dispatch) => {
  dispatch({
    type: UPDATE_TOUR_STEP_DATA_SET.REQUEST,
    id: updatedStepId,
  });
  return tourService.post.updateStepDataSet(newDataSetId, updatedStepId).then(
    response =>
      dispatch({
        type: UPDATE_TOUR_STEP_DATA_SET.SUCCESS,
        id: updatedStepId,
        updatedStepId,
        newDataSetId: response.data.new_data_set_id,
        index,
      }),
    error =>
      dispatch({
        type: UPDATE_TOUR_STEP_DATA_SET.ERROR,
        id: updatedStepId,
        error,
      }),
  );
};

export const deleteTourStep = (stepId, tourId) => (dispatch) => {
  dispatch({
    type: DELETE_TOUR_STEP.REQUEST,
    id: stepId,
  });
  return tourService.delete.deleteStep(stepId, tourId).then(
    response =>
      dispatch({
        type: DELETE_TOUR_STEP.SUCCESS,
        id: response.data.stepId,
      }),
    error =>
      dispatch({
        type: DELETE_TOUR_STEP.ERROR,
        error,
      }),
  );
};

export const reorderTourSteps = (tourId, result) => (dispatch) => {
  dispatch({
    type: REORDER_TOUR_STEPS.REQUEST,
    result,
  });
  return tourService.post.reorderTourSteps(tourId, result).then(
    response =>
      dispatch({
        type: REORDER_TOUR_STEPS.SUCCESS,
        result: response.data.result,
      }),
    error =>
      dispatch({
        type: REORDER_TOUR_STEPS.ERROR,
        error,
      }),
  );
};

export function changeActiveTourStep(id) {
  return {
    type: CHANGE_ACTIVE_TOUR_STEP,
    id,
  };
}

export const createMarker = (newMarker, step, stepIndex) => (dispatch) => {
  dispatch({
    type: CREATE_MARKER.REQUEST,
  });
  return tourService.post.createMarker(newMarker, step.id).then(
    response =>
      dispatch({
        type: CREATE_MARKER.SUCCESS,
        newMarker: response.data.new_marker,
        step,
        stepIndex,
      }),
    error =>
      dispatch({
        type: CREATE_MARKER.ERROR,
        error,
      }),
  );
};

export const deleteMarker = (marker, step, stepIndex) => ({
  type: DELETE_MARKER,
  marker,
  step,
  stepIndex,
});


// I'm testing something here. I am updating the redux store first with the date
// we have in the front and then updating the store with the data from the server.
// the reason for this is that the marker's position will jump back to the old position
// and when the server responds it will jump back to the new position.
export const updateMarker = (newMarker, newMarkerIndex, step, stepIndex) => (dispatch) => {
  dispatch({
    type: UPDATE_MARKER.REQUEST,
    id: newMarker.id,
  });
  return tourService.post.updateMarker(newMarker).then(
    response =>
      dispatch({
        type: UPDATE_MARKER.SUCCESS,
        id: newMarker.id,
        newMarker: response.data.new_marker,
        newMarkerIndex,
        step,
        stepIndex,
      }),
    error =>
      dispatch({
        type: UPDATE_MARKER.ERROR,
        error,
        id: newMarker.id,
      }),
  );
};

export const updateMarkerPosition = (newMarker, newMarkerIndex, step, stepIndex) => (dispatch) => {
  dispatch({
    type: UPDATE_MARKER_POSITION.REQUEST,
    id: newMarker.id,
    newMarker,
    newMarkerIndex,
    step,
    stepIndex,
  });
  return tourService.post.updateMarker(newMarker).then(
    response =>
      dispatch({
        type: UPDATE_MARKER_POSITION.SUCCESS,
        id: response.data.id,
      }),
    error =>
      dispatch({
        type: UPDATE_MARKER_POSITION.ERROR,
        error,
        id: newMarker.id,
      }),
  );
};

export const togglePreviewTourMode = () => ({
  type: TOGGLE_PREVIEW_TOUR_MODE,
});

export const closeOpenTour = () => ({
  type: CLOSE_OPEN_TOUR,
});

export const initPublishTour = () => ({
  type: PUBLISH_TOUR.INIT,
});

export const publishTour = tourId => (dispatch) => {
  dispatch({
    type: PUBLISH_TOUR.REQUEST,
  });
  return tourService.get.publish(tourId).then(
    () =>
      dispatch({
        type: PUBLISH_TOUR.SUCCESS,
      }),
    error =>
      dispatch({
        type: PUBLISH_TOUR.ERROR,
        error,
      }),
  );
};
