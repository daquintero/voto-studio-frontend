export const TOGGLE_NEW_TOUR_MODAL = 'TOGGLE_NEW_TOUR_MODAL';
export const CREATE_TOUR = 'CREATE_TOUR';

export function toggleNewTourModal() {
  return {
    type: TOGGLE_NEW_TOUR_MODAL,
  };
}

export function createTour(data) {
  return {
    type: CREATE_TOUR,
    data,
  };
}
