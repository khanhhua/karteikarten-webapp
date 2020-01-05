import React from 'react';
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';

import { ACTION_LOGIN, STATUS_ERROR, STATUS_PENDING } from '../constants';

const LoginPage = ({ dispatch }) => (
  <div className='container-fluid'>
    <div className='row justify-content-center'>
      <div className='col-5'>
        <h1>Login</h1>
        <GoogleLogin
          // buttonText='Login with Google'
          approvalPrompt='force'
          clientId={'166406152582-k33pgvfgfc0e4u0ujsgak5ps2ps66d46.apps.googleusercontent.com'}
          scope='profile email'
          onSuccess={(authData) => dispatch({ type: ACTION_LOGIN, status: STATUS_PENDING, authData })}
          onFailure={(authData) => dispatch({ type: ACTION_LOGIN, status: STATUS_ERROR, authData })}
        />
      </div>
    </div>
  </div>
);

export default connect(null, dispatch => ({ dispatch }))(LoginPage);
