import { useState } from 'react';

import styles from '../../styles/Home.module.css';

export const Register = ({
  onClick,
  onRegister
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const onClickRegister = () => (
    onRegister({
      username,
      email
    })
  );

  return (
    <aside
      className={styles.overlay}
      onClick={onClick}
      id="register-overlay"
    >
      <div role="dialog">
        <div role="form">
          <section>
            <label htmlFor="username">Your desired username:</label>
            <input
              name="username"
              id="username"
              className={styles.input}
              placeholder="Username"
              onChange={({ target: { value }}) => setUsername(value)}
              value={username}
            />
            <label htmlFor="email">Your email address:</label>
            <input
              name="email"
              id="email"
              className={styles.input}
              placeholder="Email address"
              onChange={({ target: { value }}) => setEmail(value)}
              value={email}
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
