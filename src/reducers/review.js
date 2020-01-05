import {
  ANSWER_MATCH,
  REVIEW_CARD,
  REVIEW_COLLECTION, REVIEW_RESULT,
  STATUS_PENDING,
  STATUS_SUCCESS,
} from '../constants';

const initialState = {
  reviewCollection: null,
  cardIndex: 0,
  scorecards: [],
};

export default (state=initialState, action) => {
  if (action.status === STATUS_PENDING) {
    return state;
  }

  switch (action.type) {
    case REVIEW_COLLECTION: {
      if (action.status === STATUS_SUCCESS) {
        return {
          ...state,
          scorecards: [],
          reviewCollection: {
            ...action.collection,
          },
          cardIndex: action.cardIndex,
          complete: false,
        };
      }

      return state;
    }
    case REVIEW_CARD: {
      if (action.status === STATUS_SUCCESS) {
        return {
          ...state,
          cardIndex: action.cardIndex,
        };
      }

      return state;
    }
    case ANSWER_MATCH: {
      if (action.status === STATUS_SUCCESS) {
        return {
          ...state,
          scorecards: state.scorecards.concat(action.scorecard),
        };
      }

      return state;
    }
    case REVIEW_RESULT: {
      if (action.status === STATUS_SUCCESS) {
        return {
          ...state,
          complete: true,
        };
      }

      return state;
    }
    default: return state;
  }
};
