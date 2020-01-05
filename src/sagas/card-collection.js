import { put, takeEvery } from 'redux-saga/effects';
import {
  CREATE_CARD_IN_NEW_COLLECTION,
  CREATE_CARD_IN_COLLECTION,
  CREATE_COLLECTION,
  FETCH_COLLECTIONS,
  UPDATE_COLLECTION,
  VIEW_COLLECTION,
  STATUS_ERROR,
  STATUS_PENDING,
  STATUS_SUCCESS, UPDATE_CARD_IN_COLLECTION
} from '../constants';
import { get, patch, post } from './utils';
import { replace } from 'react-router-redux';

function* doCreateCollection(action) {
  const { collection } = action;
  const payload = yield post('http://localhost:8080/collections', collection);

  if (!payload.ok) {
    yield put({ type: CREATE_COLLECTION, status: STATUS_ERROR, error: payload.error });
  } else {
    yield put({ type: CREATE_COLLECTION, status: STATUS_SUCCESS, collection: payload.collection });
    yield put(replace('/create-collection/step-1'));
  }
}

function* doAddNewCardToCollection(action) {
  const { type, collection, card } = action;
  const cardPayload = yield post('http://localhost:8080/cards', card);
  if (!cardPayload.ok) {
    yield put({ type, status: STATUS_ERROR, error: cardPayload.error });
    return;
  }

  const collectionPayload = yield patch(`http://localhost:8080/collections/${collection.id}`, {
    item_ids: collection.item_ids.concat(cardPayload.card.id),
  });
  if (!cardPayload.ok) {
    yield put({ type, status: STATUS_ERROR, error: collectionPayload.error });
    return;
  }

  if (type === CREATE_CARD_IN_NEW_COLLECTION) {
    yield put({
      type,
      status: STATUS_SUCCESS,
      collection: collectionPayload.collection,
      card: cardPayload.card,
    });
  } else {
    yield doViewCollection({ collectionId: collectionPayload.collection.id });
  }
}

function* doFetchCollections(action) {
  const collectionsPayload = yield get('http://localhost:8080/collections');
  if (!collectionsPayload.ok) {
    yield put({ type: FETCH_COLLECTIONS, status: STATUS_ERROR, error: collectionsPayload.error });
    return;
  }

  yield put({
    type: FETCH_COLLECTIONS,
    status: STATUS_SUCCESS,
    collections: collectionsPayload.collections,
  });
}

function* doViewCollection(action) {
  const { collectionId } = action;
  const collectionPayload = yield get(`http://localhost:8080/collections/${collectionId}`);
  if (!collectionPayload.ok) {
    yield put({ type: VIEW_COLLECTION, status: STATUS_ERROR, error: collectionPayload.error });
    return;
  }

  yield put({
    type: VIEW_COLLECTION,
    status: STATUS_SUCCESS,
    collection: collectionPayload.collection,
  });
}

function* doUpdateCollection(action) {
  const { collection: { id, ...collection } } = action;
  const collectionPayload = yield patch(`http://localhost:8080/collections/${id}`, collection);
  if (!collectionPayload.ok) {
    yield put({ type: UPDATE_COLLECTION, status: STATUS_ERROR, error: collectionPayload.error });
    return;
  }

  yield put({
    type: UPDATE_COLLECTION,
    status: STATUS_SUCCESS,
    collection: collectionPayload.collection,
  });
}

function* doUpdateCardInCollection(action) {
  const { type, collection, card: { id, ...card } } = action;
  const cardPayload = yield patch(`http://localhost:8080/cards/${id}`, card);

  if (!cardPayload.ok) {
    yield put({ type, status: STATUS_ERROR, error: cardPayload.error });
    return;
  }

  yield put({
    type,
    status: STATUS_SUCCESS,
    collection,
    card: cardPayload.card,
  });
}

export default function* () {
  yield takeEvery(({ type, status }) => type === CREATE_COLLECTION && status === STATUS_PENDING, doCreateCollection);
  yield takeEvery(({ type, status }) => (type === CREATE_CARD_IN_NEW_COLLECTION || type === CREATE_CARD_IN_COLLECTION)
    && status === STATUS_PENDING, doAddNewCardToCollection);
  yield takeEvery(({ type, status }) => type === UPDATE_CARD_IN_COLLECTION && status === STATUS_PENDING, doUpdateCardInCollection);
  yield takeEvery(({ type, status }) => type === FETCH_COLLECTIONS && status === STATUS_PENDING, doFetchCollections);
  yield takeEvery(({ type, status }) => type === VIEW_COLLECTION && status === STATUS_PENDING, doViewCollection);
  yield takeEvery(({ type, status }) => type === UPDATE_COLLECTION && status === STATUS_PENDING, doUpdateCollection);
}
