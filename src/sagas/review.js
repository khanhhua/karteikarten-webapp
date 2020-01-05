import { put, select, takeEvery } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import {
  ANSWER_MATCH, REVIEW_CARD,
  REVIEW_COLLECTION, REVIEW_RESULT,
  STATUS_ERROR,
  STATUS_PENDING,
  STATUS_SUCCESS,
} from '../constants';
import { get, patch } from './utils';

function* doReviewCollection(action) {
  const { collectionId } = action;
  const collectionPayload = yield get(`http://localhost:8080/collections/${collectionId}`);
  if (!collectionPayload.ok) {
    yield put({ type: REVIEW_COLLECTION, status: STATUS_ERROR, error: collectionPayload.error });
    return;
  }

  const { items } = collectionPayload.collection;
  items.sort(() => Math.round(Math.random() * 2 - 1));
  const itemsWithChoices = items.map(item => {
    const sourceItems = [...items];
    const choices = new Array(Math.min(sourceItems.length - 1, 3)).fill(0).map(() => {
      let choice;

      do {
        const count = sourceItems.length;
        [choice] = sourceItems.splice(Math.floor(Math.random() * count), 1);
      } while (choice.id === item.id);

      return choice;
    });
    choices.splice(Math.floor(Math.random() * 3), 0, item);

    return {
      ...item,
      choices,
    };
  });

  yield put({
    type: REVIEW_COLLECTION,
    status: STATUS_SUCCESS,
    collection: {
      ...collectionPayload.collection,
      items: itemsWithChoices,
    },
    cardIndex: 0,
  });
}

function* doAnswerMatch(action) {
  const { answer: { card, choice } } = action;
  const payload = card.id === choice.id
    ? {
      corrects: 1,
    }
    : {
      wrongs: 1,
    };
  const scorecardPayload = yield patch(`http://localhost:8080/me/scorecard/${card.id}`, payload);
  if (!scorecardPayload.ok) {
    yield put({ type: ANSWER_MATCH, status: STATUS_ERROR, error: scorecardPayload.error });
    return;
  }

  yield put({
    type: ANSWER_MATCH,
    status: STATUS_SUCCESS,
    scorecard: {
      ...scorecardPayload.scorecard,
      card,
      correct: card.id === choice.id,
    },
  });

  const { reviewCollection, cardIndex } = yield select(state => ({
    reviewCollection: state.review.reviewCollection,
    cardIndex: state.review.cardIndex,
  }));

  if (cardIndex < reviewCollection.items.length - 1) {
    yield put({
      type: REVIEW_CARD,
      status: STATUS_SUCCESS,
      cardIndex: cardIndex + 1,
    });
  } else {
    yield put({
      type: REVIEW_RESULT,
      status: STATUS_SUCCESS,
    });
    yield put(replace('/review/result'));
  }
}

export default function* () {
  yield takeEvery(({ type, status }) => type === REVIEW_COLLECTION && status === STATUS_PENDING, doReviewCollection);
  yield takeEvery(({ type, status }) => type === ANSWER_MATCH && status === STATUS_PENDING, doAnswerMatch);
}
