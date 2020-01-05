import { ACTION_LOGIN, STATUS_PENDING, STATUS_SUCCESS } from '../constants';

const initialState = {
  loggedIn: false,
};

export default (state=initialState, action) => {
  if (action.status === STATUS_PENDING) {
    return state;
  }

  switch (action.type) {
    case ACTION_LOGIN: {
      if (action.status === STATUS_SUCCESS) {
        localStorage.setItem('access_token', action.accessToken);
        return {
          ...state,
          loggedIn: true,
        };
      } else {
        localStorage.removeItem('access_token');
        return {
          ...state,
          loggedIn: false,
        };
      }
    }
    default: return state;
  }
};
