import { useState } from 'react';

import {
  Draft,
  Register
} from '../';

import { UNKNOWN_ERROR } from '../../constants';

import styles from '../../styles/Home.module.css';

export const Overlay = ({
  isDraftShown,
  setIsDraftShown,
  isRegisterShown,
  setIsRegisterShown,
  handleAPIResponse, 
  showNotification 
}) => {
  const onCreatePost = async body => {
    const response = await fetch('/api/post/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response?.ok) {
      setIsDraftShown(false);

      return handleAPIResponse(response);
    }

    showNotification(response?.message || UNKNOWN_ERROR);
  };

  const onCreateUser = async body => {
    const response = await fetch('/api/user/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (response?.ok) {
      setIsRegisterShown(false);

      return handleAPIResponse(response);
    }

    showNotification(response?.message || UNKNOWN_ERROR);
  };

  const onClickOverlay = ({ target: { id } }) => {
    if (id === 'draft-overlay') {
      setIsDraftShown(false);
    }

    if (id === 'register-overlay') {
      setIsRegisterShown(false);
    }
  };

  return (
    <aside>
      {isRegisterShown && (
        <Register
          onClick={onClickOverlay}
          onRegister={onCreateUser}
          showNotification={showNotification}
        />
      )}
      {isDraftShown && (
        <Draft
          onClick={onClickOverlay}
          onPost={onCreatePost}
          showNotification={showNotification}
        />
      )}
    </aside>
  );
};
