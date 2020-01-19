import { all } from 'redux-saga/effects';
import auth from './auth';
import cardAndCollection from './card-collection';
import review from './review';
import media from './media';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([auth(), cardAndCollection(), review(), media(), /*, another saga here*/]);
}
