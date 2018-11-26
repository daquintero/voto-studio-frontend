import {
  LIST_TOURS,
  CREATE_TOUR,
  OPEN_TOUR,
  CREATE_TOUR_STEP,
  DELETE_TOUR_STEP,
  UPDATE_TOUR_STEP,
  REORDER_TOUR_STEPS,
  CREATE_MARKER,
  UPDATE_MARKER,
  DELETE_MARKER,
} from '../actionCreators/tourActionCreators';


const initialState = { // Remember to update both the tours array and the newTour object!
  idCode: 'T',
  loadedTourId: -1,
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
  newMapData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    // List tours reducers
    case LIST_TOURS.SUCCESS:
      return {
        ...state,
        tourList: action.tourList,
      };
    case LIST_TOURS.ERROR:
      return {
        ...state,
        tourList: { error: action.error },
      };

    // Create tour reducers. Should the new tour be added the openTour and opened
    // upon creation or should it be pushed the the tour list?
    case CREATE_TOUR.SUCCESS:
      return {
        ...state,
        openTour: action.newTour,
      };
    case CREATE_TOUR.ERROR:
      return {
        ...state,
        openTour: { error: action.error },
      };

    // Open tour reducers ------------------------------
    case OPEN_TOUR.SUCCESS:
      return {
        ...state,
        openTour: action.tour,
      };
    case OPEN_TOUR.ERROR:
      return {
        ...state,
        openTour: { error: action.error },
      };
      // -----------------------------------------------

    // Create tour step reducers -----------------------
    case CREATE_TOUR_STEP.SUCCESS:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: [
            ...state.openTour.steps,
            action.newTourStep,
          ],
        },
      };
    case CREATE_TOUR_STEP.ERROR:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: state.openTour.steps,
          error: action.error,
        },
      };
      // -----------------------------------------------

    // Delete tour step reducers -----------------------
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
      // -----------------------------------------------

    // Update tour step reducers -----------------------
    case UPDATE_TOUR_STEP.SUCCESS:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: [
            ...state.newTour.steps.slice(0, action.index),
            action.updatedTourStep,
            ...state.newTour.steps.slice(action.index + 1),
          ],
        },
      };

    case UPDATE_TOUR_STEP.ERROR: // Not sure if putting the error there is correct
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: [
            ...state.newTour.steps.slice(0, action.index),
            { error: action.error },
            ...state.newTour.steps.slice(action.index + 1),
          ],
        },
      };
      // -----------------------------------------------

    // Reorder tour steps reducer ----------------------
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
    default:
      return state;
  }
}
