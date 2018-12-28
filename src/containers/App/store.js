import thunk from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as reduxFormReducer } from 'redux-form';
import {
  sidebarReducer,
  mapReducer,
  tourReducer,
  userReducer,
  dataSuiteReducer,
  changesReducer,
  workshopReducer,
} from '../../redux/reducers/index';
import { LOGOUT_USER } from '../../redux/actionCreators/userActionCreators';

const studioReducer = combineReducers({
  tours: tourReducer,
  dataSuite: dataSuiteReducer,
  changes: changesReducer,
  workshop: workshopReducer,
});

// TODO: Big restructuring needed here...

const appReducer = combineReducers({
  form: reduxFormReducer, // mounted under "form",
  sidebar: sidebarReducer,
  map: mapReducer,
  studio: studioReducer,
  auth: userReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_USER) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
