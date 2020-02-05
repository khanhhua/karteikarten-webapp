import { put, takeEvery } from 'redux-saga/effects';
import {
  ROTATE_IMAGE_LEFT,
  ROTATE_IMAGE_RIGHT,
  STATUS_ERROR,
  STATUS_PENDING,
  STATUS_SUCCESS,
  UPLOAD_ASSET
} from '../constants';
import { make } from './utils';

const { post, put: httpPut } = make(process.env.REACT_APP_API_BASE_URL);

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

async function doRotate(mediaId, op) {
  console.log(`Rotating media ${mediaId}...`);
  return httpPut(`/media/${mediaId}?op=${op}`);
}

function* doRotateLeft(action) {
  const { type, mediaContext, media } = action;
  try {
    const payload = yield doRotate(media.id, 'rotate_left');
    yield put({ type, status: STATUS_SUCCESS, mediaContext, media: payload.media });
  } catch (e) {
    yield put({ type, status: STATUS_ERROR, mediaContext, error: e });
  }
}

function* doRotateRight(action) {
  const { type, mediaContext, media } = action;
  try {
    const payload = yield doRotate(media.id, 'rotate_right');
    yield put({ type, status: STATUS_SUCCESS, mediaContext, media: payload.media });
  } catch (e) {
    yield put({ type, status: STATUS_ERROR, mediaContext, error: e });
  }
}

export default function* () {
  yield takeEvery(({ type, status }) => type === UPLOAD_ASSET && status === STATUS_PENDING, doUpload);
  yield takeEvery(({ type, status }) => type === ROTATE_IMAGE_LEFT && status === STATUS_PENDING, doRotateLeft);
  yield takeEvery(({ type, status }) => type === ROTATE_IMAGE_RIGHT && status === STATUS_PENDING, doRotateRight);
}
