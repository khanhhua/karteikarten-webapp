import { STATUS_ERROR, STATUS_PENDING, STATUS_SUCCESS } from '../constants';

const initialState = {
  busy: false,
  error: null,
};

export default (state=initialState, action) => {
  if (action.status === STATUS_PENDING) {
    return {
      ...state,
      busy: true,
    };
  } else if (action.status === STATUS_ERROR) {
    return {
      ...state,
      busy: false,
      error: action.error,
    };
  } else if (action.status === STATUS_SUCCESS) {
    return {
      ...state,
      error: null,
      busy: false,
    }
  }

  return initialState;
}
