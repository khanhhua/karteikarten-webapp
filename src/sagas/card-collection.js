import { put, select, takeEvery } from 'redux-saga/effects';
import {
  CREATE_CARD_IN_NEW_COLLECTION,
  CREATE_CARD_IN_COLLECTION,
  CREATE_COLLECTION,
  FETCH_COLLECTIONS,
  UPDATE_COLLECTION,
  VIEW_COLLECTION,
  STATUS_ERROR,
  STATUS_PENDING,
  STATUS_SUCCESS, UPDATE_CARD_IN_COLLECTION, COPY_CARD, MOVE_CARD, CLONE_CARD
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

function* doCopyCardToCollection(action) {
  const { type, cardId, toCollectionId } = action;
  const editedCollectionId = yield select(state => state.coreData.editCollection.id);

  const { collection } = yield get(`http://localhost:8080/collections/${toCollectionId}`);
  if (!collection) {
    yield put({ type: COPY_CARD, status: STATUS_ERROR, error: 'Collection not found' });
    return;
  }
  const collectionPayload = yield patch(`http://localhost:8080/collections/${toCollectionId}`, {
    ...collection,
    item_ids: collection.item_ids.concat(cardId),
  });
  if (!collectionPayload.ok) {
    yield put({ type: COPY_CARD, status: STATUS_ERROR, error: collectionPayload.error });
    return;
  }

  yield put({
    type,
    status: STATUS_SUCCESS,
    collection: collectionPayload.collection,
  });

  yield doViewCollection({ collectionId: editedCollectionId });
}

function* doCloneCardToCollection(action) {
  const { type, cardId, toCollectionId } = action;

  const { card } = yield get(`http://localhost:8080/cards/${cardId}`);
  if (!card) {
    yield put({ type: CLONE_CARD, status: STATUS_ERROR, error: 'Card not found' });
    return;
  }
  const { card: { id: clonedId } = {} } = yield post('http://localhost:8080/cards', {
    front: card.front,
    back: card.back,
  });
  if (!clonedId) {
    yield put({ type: CLONE_CARD, status: STATUS_ERROR, error: 'Card not found' });
    return;
  }

  const { collection } = yield get(`http://localhost:8080/collections/${toCollectionId}`);
  if (!collection) {
    yield put({ type: CLONE_CARD, status: STATUS_ERROR, error: 'Collection not found' });
    return;
  }
  const collectionPayload = yield patch(`http://localhost:8080/collections/${toCollectionId}`, {
    ...collection,
    item_ids: collection.item_ids.map(item => item === cardId ? clonedId : item),
  });
  if (!collectionPayload.ok) {
    yield put({ type: CLONE_CARD, status: STATUS_ERROR, error: collectionPayload.error });
    return;
  }

  yield put({
    type,
    status: STATUS_SUCCESS,
    collection: collectionPayload.collection,
  });

  yield doViewCollection({ collectionId: toCollectionId });
}

function* doMoveCardBetweenCollections(action) {
  const { type, cardId, fromCollectionId, toCollectionId } = action;

  const { collection: fromCollection } = yield get(`http://localhost:8080/collections/${fromCollectionId}`);
  if (!fromCollection) {
    yield put({ type: MOVE_CARD, status: STATUS_ERROR, error: 'Collection not found' });
    return;
  }

  const { collection: toCollection } = yield get(`http://localhost:8080/collections/${toCollectionId}`);
  if (!toCollection) {
    yield put({ type: MOVE_CARD, status: STATUS_ERROR, error: 'Collection not found' });
    return;
  }
  const fromCollectionPayload = yield patch(`http://localhost:8080/collections/${fromCollectionId}`, {
    ...fromCollection,
    item_ids: fromCollection.item_ids.filter(item => item !== cardId),
  });
  if (!fromCollectionPayload.ok) {
    yield put({ type: COPY_CARD, status: STATUS_ERROR, error: fromCollectionPayload.error });
    return;
  }

  const toCollectionPayload = yield patch(`http://localhost:8080/collections/${toCollectionId}`, {
    ...toCollection,
    item_ids: toCollection.item_ids.concat(cardId),
  });
  if (!toCollectionPayload.ok) {
    yield put({ type: COPY_CARD, status: STATUS_ERROR, error: toCollectionPayload.error });
    return;
  }

  yield put({
    type,
    status: STATUS_SUCCESS,
  });

  yield doViewCollection({ collectionId: fromCollectionId });
}

export default function* () {
  yield takeEvery(({ type, status }) => type === CREATE_COLLECTION && status === STATUS_PENDING, doCreateCollection);
  yield takeEvery(({ type, status }) => (type === CREATE_CARD_IN_NEW_COLLECTION || type === CREATE_CARD_IN_COLLECTION)
    && status === STATUS_PENDING, doAddNewCardToCollection);
  yield takeEvery(({ type, status }) => type === UPDATE_CARD_IN_COLLECTION && status === STATUS_PENDING, doUpdateCardInCollection);
  yield takeEvery(({ type, status }) => type === FETCH_COLLECTIONS && status === STATUS_PENDING, doFetchCollections);
  yield takeEvery(({ type, status }) => type === VIEW_COLLECTION && status === STATUS_PENDING, doViewCollection);
  yield takeEvery(({ type, status }) => type === UPDATE_COLLECTION && status === STATUS_PENDING, doUpdateCollection);
  yield takeEvery(({ type, status }) => type === COPY_CARD && status === STATUS_PENDING, doCopyCardToCollection);
  yield takeEvery(({ type, status }) => type === MOVE_CARD && status === STATUS_PENDING, doMoveCardBetweenCollections);
  yield takeEvery(({ type, status }) => type === CLONE_CARD && status === STATUS_PENDING, doCloneCardToCollection);
}
