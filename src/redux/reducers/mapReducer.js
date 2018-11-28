import {
  CHANGE_MAP_HEIGHT,
  CHANGE_MAP_WIDTH,
  CHANGE_MAP_VIEWPORT,
} from '../actions/mapActions';

const initialState = {
  viewport: {
    width: 'calc(100% - 290px)',
    height: 'calc(100vh - 60px)',
    latitude: 8,
    longitude: -80.1,
    zoom: 6,
    maxZoom: 16,
    pitch: 30,
    bearing: 0,
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CHANGE_MAP_WIDTH:
      return {
        ...state,
        viewport: {
          ...state.viewport,
          width: action.newMapWidth,
        },
      };
    case CHANGE_MAP_HEIGHT:
      return {
        ...state,
        viewport: {
          ...state.viewport,
          height: action.newMapHeight,
        },
      };
    case CHANGE_MAP_VIEWPORT:
      return {
        ...state,
        viewport: {
          ...action.newMapViewport,
          width: state.viewport.width,
          height: state.viewport.height,
        },
      };
    default:
      return state;
  }
}
