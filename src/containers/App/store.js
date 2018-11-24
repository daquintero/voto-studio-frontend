import thunk from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as reduxFormReducer } from 'redux-form';
import {
  sidebarReducer,
  themeReducer,
  mapReducer,
  tourReducer,
  userReducer,
} from '../../redux/reducers/index';
import { LOGOUT_USER } from '../../redux/actions/userActions';

const appReducer = combineReducers({
  form: reduxFormReducer, // mounted under "form",
  theme: themeReducer,
  sidebar: sidebarReducer,
  map: mapReducer,
  tours: tourReducer,
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
