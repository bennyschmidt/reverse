import { useState } from 'react';

import styles from '../../styles/Home.module.css';

const PEER_SERVER = 'reverse-social.vercel.app';

export const Draft = ({
  onClick,
  onPost,
  showNotification,
  user
}) => {
  const [post, setPost] = useState('');
  const [server, setServer] = useState(PEER_SERVER);

  const onClickPost = () => {
    const invalidParam = (
      !(/^.{2,280}$/i.test(post))
        ? 'post format'
        : false
    );

    if (invalidParam) {
      showNotification(`Invalid ${invalidParam}.`);

      return;
    }

    onPost({
      token: user.token,
      post,
      server
    });
  };

  return (
    <aside
      className={styles.overlay}
      onClick={onClick}
      id="draft-overlay"
    >
      <div role="dialog">
        <div role="form">
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
