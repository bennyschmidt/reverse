import { useEffect, useState } from 'react';

import styles from '../../styles/Home.module.css';

export const Auth = ({
  onClickSignUp,
  onClickSignIn,
  isFetching
}) => {
  const [authInput, setAuthInput] = useState();

  const onChangeAuthInput = ({ target: { value }}) => {
    setAuthInput(value);
  };

  const onClickAddressAuth = () => onClickSignIn(authInput);

  return (
    <div className={styles.cta}>
      <h3>
        New to Reverse?
      </h3>
      <button disabled={isFetching} onClick={onClickSignUp}>
        Sign up with email
      </button>
      <h3>
        Sign In
      </h3>
      <input
        disabled={isFetching}
        className={styles.input}
        placeholder="Dereva address or email"
        onChange={onChangeAuthInput}
        value={authInput}
      />
      <button disabled={isFetching} onClick={onClickAddressAuth}>
        Sign in
      </button>
    </div>
  );
};
