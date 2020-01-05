import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './auth';
import coreData from './card-collection';
import review from './review';

export default combineReducers({
  routing: routerReducer,
  auth,
  coreData,
  review,
});
