import {
  CREATE_CARD_IN_NEW_COLLECTION,
  CREATE_COLLECTION,
  FETCH_COLLECTIONS,
  VIEW_COLLECTION,
  STATUS_PENDING,
  STATUS_SUCCESS, CREATE_CARD_IN_COLLECTION, UPDATE_CARD_IN_COLLECTION
} from '../constants';

const initialState = {
  newCollection: null,
  newCard: null,
  editCollection: null,
  collections: [],
};

export default (state=initialState, action) => {
  if (action.status === STATUS_PENDING) {
    return state;
  }

  switch (action.type) {
    case CREATE_COLLECTION: {
      if (action.status === STATUS_SUCCESS) {
        return {
          ...state,
          newCollection: {
            ...action.collection,
            items: [],
          },
        };
      }

      return state;
    }
    case CREATE_CARD_IN_NEW_COLLECTION: {
      if (action.status === STATUS_SUCCESS) {
        if (state.newCollection && action.collection.id === state.newCollection.id) {
          return {
            ...state,
            newCollection: {
              ...state.newCollection,
              item_ids: state.newCollection.item_ids.concat(action.card.id),
              items: state.newCollection.items.concat(action.card),
            },
            newCard: action.card,
          };
        }
      }

      return state;
    }
    case UPDATE_CARD_IN_COLLECTION: {
      if (action.status === STATUS_SUCCESS) {
        const editCollection = {
          ...action.collection,
          items: action.collection.items.map(item => {
            if (item.id === action.card.id) {
              return action.card;
            }

            return item;
          })
        };

        return {
          ...state,
          editCollection,
        };
      }
      return state;
    }
    case FETCH_COLLECTIONS: {
      if (action.status === STATUS_SUCCESS) {
        return {
          ...state,
          collections: action.collections,
        };
      }

      return state;
    }
    case VIEW_COLLECTION: {
      if (action.status === STATUS_SUCCESS) {
        return {
          ...state,
          editCollection: {
            ...action.collection,
          },
        };
      }

      return state;
    }
    default: return state;
  }
};
