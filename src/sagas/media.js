import { put, takeEvery } from 'redux-saga/effects';
import { STATUS_ERROR, STATUS_PENDING, STATUS_SUCCESS, UPLOAD_ASSET } from '../constants';
import { make } from './utils';

const { post } = make(process.env.REACT_APP_API_BASE_URL);

function* doUpload(action) {
  const { type, mediaContext, file } = action;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const payload = yield post('/media', formData);

    if (!payload.ok) {
      yield put({ type, status: STATUS_ERROR, error: payload.error });
    } else {
      yield put({ type, status: STATUS_SUCCESS, mediaContext, media: payload.media });
    }
  } catch (e) {
    yield put({ type, status: STATUS_ERROR, error: e });
  }
}

export default function* () {
  yield takeEvery(({ type, status }) => type === UPLOAD_ASSET && status === STATUS_PENDING, doUpload);
}
