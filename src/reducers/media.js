import { STATUS_PENDING, STATUS_SUCCESS, UPLOAD_ASSET } from '../constants';

const initialState = {
  globalContext: {},
};

export default (state=initialState, action) => {
  if (action.status === STATUS_PENDING) {
    return state;
  }

  if (action.status !== STATUS_SUCCESS) {
    return state;
  }

  switch (action.type) {
    case UPLOAD_ASSET: {
      return {
        ...state,
        // TODO Remove items if there are too many
        [action.mediaContext]: action.media,
      }
    }
  }

  return state;
}
