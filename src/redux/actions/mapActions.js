export const CHANGE_MAP_WIDTH = 'CHANGE_MAP_WIDTH';
export const CHANGE_MAP_HEIGHT = 'CHANGE_MAP_HEIGHT';
export const CHANGE_MAP_VIEWPORT = 'CHANGE_MAP_VIEWPORT';

export function changeMapWidth(newMapWidth) {
  return {
    type: CHANGE_MAP_WIDTH,
    newMapWidth,
  };
}

export function changeMapHeight(newMapHeight) {
  return {
    type: CHANGE_MAP_HEIGHT,
    newMapHeight,
  };
}

export function changeMapViewport(newMapViewport) {
  return {
    type: CHANGE_MAP_VIEWPORT,
    newMapViewport,
  };
}
