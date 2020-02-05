import React from 'react';
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';

import { ACTION_LOGIN, STATUS_ERROR, STATUS_PENDING } from '../constants';

const GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_OATH_CLIENT_ID;

const LoginPage = ({ dispatch }) => (
  <div className='container-fluid'>
    <div className='row justify-content-center'>
      <div className='col-7 karteikarten-login'>
        <h1>Login</h1>
        <GoogleLogin
          buttonText='Login with Google'
          approvalPrompt='force'
          clientId={GOOGLE_OAUTH_CLIENT_ID}
          scope='profile email'
          onSuccess={(authData) => dispatch({ type: ACTION_LOGIN, status: STATUS_PENDING, authData })}
          onFailure={(authData) => dispatch({ type: ACTION_LOGIN, status: STATUS_ERROR, authData })}
        />
      </div>
    </div>
  </div>
);

export default connect(null, dispatch => ({ dispatch }))(LoginPage);
