import thunk from 'redux-thunk';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as reduxFormReducer } from 'redux-form';
import {
  sidebarReducer,
  themeReducer,
  mapReducer,
  tourReducer,
} from '../../redux/reducers/index';

const reducer = combineReducers({
  form: reduxFormReducer, // mounted under "form",
  theme: themeReducer,
  sidebar: sidebarReducer,
  map: mapReducer,
  tours: tourReducer,
});

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
