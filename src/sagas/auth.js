import { put, takeEvery } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import { ACTION_LOGIN, STATUS_ERROR, STATUS_PENDING, STATUS_SUCCESS } from '../constants';
import { make } from './utils';

const { post } = make(process.env.REACT_APP_API_BASE_URL);

function* doLogin(action) {
  const { authData } = action;
  const payload = yield post('/auth/register', {
    id_token: authData.tokenId,
  });

  if (!payload.ok) {
    yield put({ type: ACTION_LOGIN, status: STATUS_ERROR, error: payload.error });
  } else {
    yield put({ type: ACTION_LOGIN, status: STATUS_SUCCESS, accessToken: payload.access_token });
    yield put(replace('/'));
  }
}

export default function* () {
  yield takeEvery(({ type, status }) => type === ACTION_LOGIN && status === STATUS_PENDING, doLogin);
}
