import {
  PUSH_NEW_TOUR,
  CREATE_TOUR,
  OPEN_TOUR,
  TOGGLE_NEW_TOUR_MODAL,
  CREATE_TOUR_STEP,
  UPDATE_TOUR_STEP,
  REORDER_TOUR_STEPS,
  DELETE_TOUR_STEP,
  CREATE_MARKER,
  UPDATE_MARKER,
  DELETE_MARKER,
} from '../actions/tourActions';


const initialState = { // Remember to update both the tours array and the newTour object!
  idCode: 'T',
  tours: [
    {
      id: 0,
      name: 'Testing',
      description: 'This is tour that is loaded by default for testing purposes.',
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
            transitionDuration: 2000,
            transitionEasingName: 'd3.easeCubic',
            transitionInterpolatorName: 'FlyToInterpolator',
          },
          markers: [
            {
              id: 0,
              name: 'Marker One',
              text: 'This is where this thing happened',
              latitude: 8,
              longitude: -80.1,
              updating: false,
              width: 200,
              height: 200,
            },
          ],
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
            transitionDuration: 3000,
            transitionEasingName: 'd3.easeCubic',
            transitionInterpolatorName: 'FlyToInterpolator',
          },
          markers: [],
        },
      ],
    },
    {
      id: 1,
      name: 'More Testing',
      description: 'This is another tour that is loaded by default for further testing purposes.',
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
            transitionDuration: 2000,
            transitionEasingName: 'd3.easeCubic',
            transitionInterpolatorName: 'FlyToInterpolator',
          },
          markers: [],
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
            transitionDuration: 3000,
            transitionEasingName: 'd3.easeCubic',
            transitionInterpolatorName: 'FlyToInterpolator',
          },
          markers: [],
        },
        {
          id: 2,
          name: 'Step Three',
          text: 'So. Much. Testing...',
          viewport: {
            width: 1680,
            height: 909,
            latitude: 8,
            longitude: -80.1,
            zoom: 6,
            maxZoom: 16,
            pitch: 30,
            bearing: 0,
            transitionDuration: 3000,
            transitionEasingName: 'd3.easeCubic',
            transitionInterpolatorName: 'FlyToInterpolator',
          },
          markers: [],
        },
      ],
    },
  ],
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
          transitionDuration: 2000,
          transitionEasingName: 'd3.easeCubic',
          transitionInterpolatorName: 'FlyToInterpolator',
        },
        markers: [
          {
            id: 0,
            name: 'Marker One',
            text: 'This is where this thing happened',
            latitude: 8,
            longitude: -80.1,
            updating: false,
            width: 200,
            height: 200,
          },
        ],
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
          transitionDuration: 3000,
          transitionEasingName: 'd3.easeCubic',
          transitionInterpolatorName: 'FlyToInterpolator',
        },
        markers: [],
      },
    ],
  },
  newTourModal: false,
  mapData: {
    idCode: 'MD',
    sets: [
      {
        id: 0,
        name: 'Candidate Power',
        description: 'A visualisation of the power a candidate has in a given region.',
        data: {},
        size: '1.34KB',
      },
    ],
  },
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
    case OPEN_TOUR:
      return {
        ...state,
        newTour: action.tour,
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
    case CREATE_MARKER:
      return {
        ...state,
        newTour: {
          ...state.newTour,
          steps: [
            ...state.newTour.steps.slice(0, action.stepIndex),
            {
              ...action.step,
              markers: [
                ...action.step.markers,
                action.newMarker,
              ],
            },
            ...state.newTour.steps.slice(action.stepIndex + 1),
          ],
        },
      };
    case UPDATE_MARKER:
      return {
        ...state,
        newTour: {
          ...state.newTour,
          steps: [
            ...state.newTour.steps.slice(0, action.stepIndex),
            {
              ...action.step,
              markers: [
                ...action.step.markers.slice(0, action.newMarkerIndex),
                action.newMarker,
                ...action.step.markers.slice(action.newMarkerIndex + 1),
              ],
            },
            ...state.newTour.steps.slice(action.stepIndex + 1),
          ],
        },
      };
    case DELETE_MARKER:
      return {
        ...state,
        newTour: {
          ...state.newTour,
          steps: [
            ...state.newTour.steps.slice(0, action.stepIndex),
            {
              ...action.step,
              markers: action.step.markers.filter(marker => marker.id !== action.marker.id),
            },
            ...state.newTour.steps.slice(action.stepIndex + 1),
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
