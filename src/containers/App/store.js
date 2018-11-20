import thunk from 'redux-thunk';
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
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
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension && window.devToolsExtension(),
  ),
);

export default store;
