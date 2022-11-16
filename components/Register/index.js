import { useState } from 'react';

import styles from '../../styles/Home.module.css';

export const Register = ({
  onClick,
  onRegister,
  showNotification
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const onClickRegister = () => {
    const invalidParam = (
      !(/^[a-z0-9_\-.]{1,64}@[a-z0-9_\-.]{1,64}$/i.test(email))
        ? 'email address'
        : !(/^[a-z0-9_.]{2,16}$/i.test(username))
          ? 'username'
          : false
    );

    if (invalidParam) {
      showNotification(`Invalid ${invalidParam}.`);

      return;
    }

    onRegister({
      username,
      email
    });
  };

  return (
    <aside
      className={styles.overlay}
      onClick={onClick}
      id="register-overlay"
    >
      <div role="dialog">
        <div role="form">
          <section>
            <label htmlFor="email">Your email address:</label>
            <input
              type="email"
              name="email"
              id="email"
              className={styles.input}
              placeholder="Email address"
              onChange={({ target: { value }}) => setEmail(value)}
              value={email}
            />
            <label htmlFor="username">Your desired username:</label>
            <input
              name="username"
              id="username"
              className={styles.input}
              placeholder="Username"
              onChange={({ target: { value }}) => setUsername(value)}
              value={username}
            />
          </section>
          <section>
            <button onClick={onClickRegister}>
              Register
            </button>
          </section>
        </div>
      </div>
    </aside>
  );
};
