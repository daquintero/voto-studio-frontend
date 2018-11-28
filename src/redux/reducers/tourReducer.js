import {
  LIST_TOURS,
  CREATE_TOUR,
  OPEN_TOUR,
  CREATE_TOUR_STEP,
  DELETE_TOUR_STEP,
  UPDATE_TOUR_STEP,
  REORDER_TOUR_STEPS,
  CHANGE_ACTIVE_TOUR_STEP,
  CREATE_MARKER,
  UPDATE_MARKER,
  DELETE_MARKER,
} from '../actionCreators/tourActionCreators';

/* Each async action will have three "states": the REQUEST state, the SUCCESS state and the ERROR state.
We will want to take action throughout the UI dependant on the what state an action is in.
For example lets say the updateTourStep action is dispatch by a component. Initially this action is in the
request state and up until this point everything is still synchronous. Then axios is used to send the
tour step updates to the server and now waits for the response, this takes time and JavaScript does not
wait until the response is back to carry on running the next line, this is where the asynchronicity comes from.
The moment we receive a response from axios we are no longer in the REQUEST state. The next state depends on the
outcome of the axios call. If it was successful we move into the SUCCESS state and we update the redux store with the
SUCCESS reducer accordingly and if there is an ERROR we are in the ERROR state and update the store using the
ERROR reducer.

The actionResult function will create an object with the same name of the action that was called. It takes a string
that describes the action and state: ACTION.STATE. For example: LIST_TOURS.REQUEST. It will then return an object
that describes the action and its state.

Example usage:

actionResult(LIST_TOURS.REQUEST)

>>> LIST_TOURS: {
      loading: true,
      loaded: false,
    }

actionResult(LIST_TOURS.SUCCESS)

>>> LIST_TOURS: {
      loading: false,
      loaded: true,
    }

actionResult(LIST_TOURS.ERROR)

>>> LIST_TOURS: {
      loading: false,
      loaded: false,
      error: ErrorObj // This will be an error object from axios
    }

Now we can pass the LIST_TOURS object to the asyncLoading component to conditionally render a loading circle,
the component or an error message dependant on the result of the api call.

<ToursList action={whateverHasBeenLoading.LIST_TOURS} ...otherProps />

Where <ToursList /> is exported like so: asyncLoading('card')(ToursList). The string 'card' is to let the
asyncLoading component how to style the loading circle and error message. In this case we know that the component
is loading data into a card so the loading circle should be centered horizontally. If we gave 'page' (for example when
the whole map component is loading) then we would want the loading circle in the center of the page so we would
center is horizontally and vertically.

The above usage is for when data is loaded from the server ie a GET request. What about a POST request? In this case
we will likely have already loaded the initial data from the server and already have a populated list. By using this
same process we can render a loading circle or error message dependent on the status of a POST request.

Example usage:

actionResult(CREATE_TOUR.REQUEST)

>>> CREATE_TOUR: {
      loading: true,
      loaded: false,
    }

actionResult(CREATE_TOUR.REQUEST)

>>> CREATE_TOUR: {
      loading: false,
      loaded: true,
    }

actionResult(CREATE_TOUR.REQUEST)

>>> CREATE_TOUR: {
      loading: false,
      loaded: false,
      error: ErrorObj // This will be an error object from axios
    }

Now we have an object CREATE_TOUR that gives us all the info about the POST request we need. In the <TourList />
render method we can now do something like this:

render() {
  return (
    ...
    {whateverHasBeenLoaded.CREATE_TOUR && whateverHasBeenLoaded.CREATE_TOUR.loading && (
      <Loader />
    )}
    {whateverHasBeenLoaded.CREATE_TOUR && whateverHasBeenLoaded.CREATE_TOUR.error && (
      <>{whateverHasBeenLoaded.CREATE_TOUR.error.message}</>
    )}
    ...
  );
}

Note: we have to check that whateverHasBeenLoaded.CREATE_TOUR is defined first otherwise shit hits the fan and react
blows up. Now the <Loader /> component will appear when the POST request is in progress and disappear when it is
complete. Additionally, if there is an error the error message will be shown to the user. I think this sums up my
approach to async. I will be slowly implementing this approach in voto-studio so check the code for usage examples */

const actionResult = (action, error = null) => {
  const [actionName, actionState] = action.split('.');
  switch (actionState) {
    case 'REQUEST':
      return { actionName, loading: true, loaded: false };
    case 'SUCCESS':
      return { actionName, loading: false, loaded: true };
    case 'ERROR':
      return {
        actionName, loading: false, loaded: false, error,
      };
    case 'INIT':
      return {
        actionName, loading: false, loaded: false, init: true,
      };
    default:
      return Error('No matching action state provided');
  }
};

const initialState = {
  idCode: 'T',
  loadedTourId: -1,
  tourList: { actionState: actionResult('LIST_TOURS.INIT') },
  openTour: { actionStatus: actionResult('OPEN_TOUR.INIT') },
  mapDataList: { actionStatus: actionResult('LIST_DATA.INIT') },
};

export default function (state = initialState, action) {
  switch (action.type) {
    // List tours reducers -----------------------------
    case LIST_TOURS.REQUEST:
      return {
        ...state,
        tourList: {
          actionStatus: actionResult('LIST_TOURS.REQUEST'),
        },
      };
    case LIST_TOURS.SUCCESS:
      return {
        ...state,
        tourList: {
          actionStatus: actionResult('LIST_TOURS.SUCCESS'),
          tours: action.tourList,
        },
      };
    case LIST_TOURS.ERROR:
      return {
        ...state,
        tourList: {
          actionStatus: actionResult('LIST_TOURS.ERROR'),
        },
      };
      // -----------------------------------------------

    // Create tour reducers ----------------------------
    case CREATE_TOUR.REQUEST:
      return {
        ...state,
        tourList: {
          ...state.tourList,
          actionStatus: actionResult('REQUEST'),
        },
      };
    case CREATE_TOUR.SUCCESS:
      return {
        ...state,
        tourList: {
          ...state.tourList,
          actionStatus: actionResult('SUCCESS'),
          tours: [
            ...state.tourList.tours,
            action.newTour,
          ],
        },
      };
    case CREATE_TOUR.ERROR:
      return {
        ...state,
        tourList: {
          ...state.tourList,
          actionStatus: actionResult('ERROR', action.error),
        },
      };
      // -----------------------------------------------

    // Open tour reducers ------------------------------
    case OPEN_TOUR.REQUEST:
      return {
        ...state,
        openTour: {
          actionStatus: actionResult('OPEN_TOUR.REQUEST'),
        },
      };
    case OPEN_TOUR.SUCCESS:
      return {
        ...state,
        openTour: {
          actionStatus: actionResult('OPEN_TOUR.SUCCESS'),
          ...action.tour,
          activeTourStepId: action.tour.steps[0].id,
        },
      };
    case OPEN_TOUR.ERROR:
      return {
        ...state,
        openTour: {
          actionStatus: actionResult('OPEN_TOUR.SUCCESS', action.error),
        },
      };
      // -----------------------------------------------

    // Create tour step reducers -----------------------
    case CREATE_TOUR_STEP.REQUEST:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          actionStatus: actionResult('CREATE_TOUR_STEP.REQUEST'),
        },
      };
    case CREATE_TOUR_STEP.SUCCESS:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          activeTourStepId: action.newTourStep.id,
          steps: [
            ...state.openTour.steps,
            {
              ...action.newTourStep,
              width: 'calc(100% - 290px)', // Override the width and height settings
              height: 'calc(100vh - 55px)',
            },
          ],
          actionStatus: actionResult('CREATE_TOUR_STEP.SUCCESS'),
        },
      };
    case CREATE_TOUR_STEP.ERROR:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          actionStatus: actionResult('CREATE_TOUR_STEP.ERROR', action.error),
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
    case REORDER_TOUR_STEPS.REQUEST:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          REORDER_TOUR_STEPS: {
            loading: true,
            loaded: false,
          },
        },
      };
    case REORDER_TOUR_STEPS.SUCCESS: {
      const newSteps = state.openTour.steps;
      newSteps.splice(action.result.source.index, 1);
      newSteps.splice(action.result.destination.index, 0, action.step);
      return {
        ...state,
        openTour: {
          ...state.openTour,
          steps: newSteps,
          reorderingSteps: {
            loading: false,
            loaded: true,
          },
        },
      };
    }
    case REORDER_TOUR_STEPS.ERROR:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          reorderingSteps: {
            loading: false,
            loaded: false,
            error: action.error,
          },
        },
      };

    // Change active tour step reducer -----------------
    // (this is synchronous)
    case CHANGE_ACTIVE_TOUR_STEP:
      return {
        ...state,
        openTour: {
          ...state.openTour,
          activeTourStepId: action.id,
        },
      };
      // -----------------------------------------------

    // Create marker reducers --------------------------
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
