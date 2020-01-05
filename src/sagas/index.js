import { all } from 'redux-saga/effects';
import auth from './auth';
import cardAndCollection from './card-collection';
import review from './review';

// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([auth(), cardAndCollection(), review() /*, another saga here*/]);
}
