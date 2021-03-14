import { put, select, takeEvery } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import uniqBy from 'lodash.uniqby';
import {
  ANSWER_MATCH, REVIEW_CARD,
  REVIEW_COLLECTION, REVIEW_RESULT,
  STATUS_ERROR,
  STATUS_PENDING,
  STATUS_SUCCESS,
} from '../constants';
import { make } from './utils';

const { get, patch } = make(process.env.REACT_APP_API_BASE_URL);

function* doReviewCollection(action) {
  const { collectionId } = action;
  const collectionPayload = yield get(`/collections/${collectionId}`);
  if (!collectionPayload.ok) {
    yield put({ type: REVIEW_COLLECTION, status: STATUS_ERROR, error: collectionPayload.error });
    return;
  }
  yield patch(`/me/recent-collections`, { collection_id: collectionId });

  const { items } = collectionPayload.collection;
  items.sort(() => Math.round(Math.random() * 2 - 1));
  const TOTAL_OPTIONS = 4;
  const sourceItems = uniqBy(items, 'back');
  const itemsWithChoices = items.map(item => {
    const choices = new Array(Math.min(sourceItems.length - 1, TOTAL_OPTIONS)).fill(0).map(() => (
      sourceItems[Math.floor(Math.random() * sourceItems.length)]
    ));

    // Replace one of the four choices with the item in question
    // - at a random index if the item is not already included
    // - at the index where an item with "back" matches the back of the item in question
    let replacedIndex = choices.findIndex(choice => item.back === choice.back);
    if (replacedIndex === -1) {
      replacedIndex = Math.floor(Math.random() * TOTAL_OPTIONS);
    }
    choices.splice(replacedIndex, 1, item);

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
  const scorecardPayload = yield patch(`/me/scorecard/${card.id}`, payload);
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
