import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import {
  Draft,
  Navigation,
  PostButton,
  Posts,
  Signup
} from '../components';

import {
  TIMEOUT_INTERVAL,
  UNKNOWN_ERROR
} from '../constants';

import styles from '../styles/Home.module.css';

export default function Home () {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [isDraftShown, setIsDraftShown] = useState(false);
  const [message, setMessage] = useState('');

  const { pathname, query } = router;

  let timeout;

  useEffect(() => {
    const handleQuery = async () => {
      const response = await fetch(`/api/post/create/confirm?post=${query.post}`);

      if (response?.ok) {
        router.replace(
          pathname,
          undefined,
          { shallow: true }
        );

        return handleAPIResponse(response);
      }

      showNotification(UNKNOWN_ERROR);
    };

    if (query.post) {
      handleQuery();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, query]);

  useEffect(() => {
    const fetchPage = async () => {
      const response = await fetch('/api/posts');

      if (response?.ok) {
        return handleAPIResponse(response);
      }

      showNotification(UNKNOWN_ERROR);
    };

    fetchPage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = message => {
    clearTimeout(timeout);
    setMessage(message);

    timeout = setTimeout(() => {
      setMessage('');
    }, TIMEOUT_INTERVAL);
  };

  const handleAPIResponse = async response => {
    const data = await response.json();

    const { isError, message } = data;

    if (message) {
      showNotification(message);
    }

    setTabs(data.tabs);
    setPosts(data.posts);
  };

  const onCreatePost = async body => {
    const response = await fetch('/api/post/create', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    if (response?.ok) {
      setIsDraftShown(false);

      return handleAPIResponse(response);
    }

    showNotification(UNKNOWN_ERROR);
  };

  const onClickOverlay = ({ target: { id } }) => {
    if (id === 'draft-overlay') {
      setIsDraftShown(false);
    }
  };

  const onClickPostButton = () => (
    setIsDraftShown(!isDraftShown)
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Reverse</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <aside className={styles[`banner${message ? '-show' : ''}`]}>
        {message}
      </aside>
      <div className={styles.logo}>
        <Image
          src="/reverse.svg"
          alt="R feather logo by ruslyeffendi3120760"
          width={40}
          height={40}
        />
      </div>
      <main className={styles.main}>
        {isDraftShown && (
          <Draft
            onClick={onClickOverlay}
            onPost={onCreatePost}
          />
        )}
        <PostButton onClick={onClickPostButton} />
        <div className={styles.grid}>
          <Navigation tabs={tabs} />
          <Posts posts={posts} />
          <Signup />
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="#" target="_blank">Fork on GitHub</a>
      </footer>
    </div>
  )
}
