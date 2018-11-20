import {
  PUSH_NEW_TOUR,
  CREATE_TOUR,
  TOGGLE_NEW_TOUR_MODAL,
  CREATE_TOUR_STEP,
  UPDATE_TOUR_STEP,
  REORDER_TOUR_STEPS,
  DELETE_TOUR_STEP,
} from '../actions/tourActions';


const initialState = {
  tours: [],
  newTour: {
    name: 'Testing',
    steps: [
      {
        id: 0,
        name: 'Step One',
        text: 'Testing with some dummy steps.',
        viewport: {
          width: 1680,
          height: 909,
          latitude: 8,
          longitude: -80.1,
          zoom: 6,
          maxZoom: 16,
          pitch: 30,
          bearing: 0,
          transitionDuration: '2000',
          transitionEasingName: 'd3.easeCubic',
          transitionInterpolatorName: 'FlyToInterpolator',
        },
      },
      {
        id: 1,
        name: 'Step Two',
        text: 'Testing with some more dummy steps.',
        viewport: {
          width: 1680,
          height: 909,
          latitude: 8,
          longitude: -80.1,
          zoom: 6,
          maxZoom: 16,
          pitch: 30,
          bearing: 0,
          transitionDuration: '3000',
          transitionEasingName: 'd3.easeCubic',
          transitionInterpolatorName: 'FlyToInterpolator',
        },
      },
    ],
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
