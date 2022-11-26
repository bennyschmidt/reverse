import Head from 'next/head';
import { useEffect, useState } from 'react';

import {
  TABS,
  TIMEOUT_INTERVAL
} from '../constants';

import '../styles/globals.css';
import styles from '../styles/Home.module.css';

export default function App ({ Component, pageProps }) {
  const [posts, setPosts] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => setTabs(TABS), []);

  let timeout;

  const showNotification = message => {
    clearTimeout(timeout);
    setMessage(message);

    timeout = setTimeout(() => {
      setMessage('');
    }, TIMEOUT_INTERVAL);
  };

  const handleAPIResponse = async response => {
    const data = await response.json();

    const { message } = data;

    if (message) {
      showNotification(message);
    }

    setPosts(data.posts);
  };

  const props = {
    ...pageProps,

    showNotification,
    handleAPIResponse,

    state: {
      posts,
      tabs
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Reverse</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo512.png" />
      </Head>
      <aside className={styles[`banner${message ? '-show' : ''}`]}>
        {message}
      </aside>
      <Component {...props} />
    </div>
  );
}
