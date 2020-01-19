import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './auth';
import coreData from './card-collection';
import review from './review';
import network from './network';
import media from './media';

export default combineReducers({
  routing: routerReducer,
  network,
  auth,
  coreData,
  review,
  media,
});
