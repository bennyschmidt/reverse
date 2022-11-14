import { useState } from 'react';

import styles from '../../styles/Home.module.css';

export const Draft = ({
  onClick,
  onPost
}) => {
  const [username, setUsername] = useState('benny');
  const [post, setPost] = useState('');
  const [server, setServer] = useState('exactchange.network');

  const onClickPost = () => (
    onPost({
      username,
      post,
      server
    })
  );

  return (
    <aside
      className={styles.overlay}
      onClick={onClick}
      id="draft-overlay"
    >
      <div role="dialog">
        <div role="form">
          <section>
            <label htmlFor="username">Post as:</label>
            <select
              name="username"
              id="username"
              className={styles.input}
              onChange={({ target: { value }}) => setUsername(value)}
            >
              <option value={username}>{username}</option>
            </select>
          </section>
          <section>
            <textarea
              className={styles.input}
              placeholder="Type something"
              onChange={({ target: { value }}) => setPost(value)}
              value={post}
            />
          </section>
          <section>
            <label htmlFor="server">Post to:</label>
            <select
              name="server"
              id="server"
              className={styles.input}
              onChange={({ target: { value }}) => setServer(value)}
            >
              <option value={server}>{server}</option>
            </select>
          </section>
          <section>
            <button onClick={onClickPost}>
              Post
            </button>
          </section>
        </div>
      </div>
    </aside>
  );
};
