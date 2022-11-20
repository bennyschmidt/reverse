import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import {
  Draft,
  Navigation,
  PostButton,
  Posts,
  Register,
  SignupButton
} from '../components';

import {
  TABS,
  TIMEOUT_INTERVAL,
  UNKNOWN_ERROR
} from '../constants';

import styles from '../styles/Home.module.css';

export default function Home () {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [isDraftShown, setIsDraftShown] = useState(false);
  const [isRegisterShown, setIsRegisterShown] = useState(false);
  const [message, setMessage] = useState('');

  const { pathname, query } = router;

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

  const onClickPostButton = () => (
    setIsDraftShown(true)
  );

  const onClickRegisterButton = () => (
    setIsRegisterShown(true)
  );

  const onChangeURL = () => {
    const handleQuery = async (type, otp) => {
      const response = await fetch(`/api/${type}/create/confirm`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ otp })
      });

      if (response?.ok) {
        router.replace(
          pathname,
          undefined,
          { shallow: true }
        );

        return handleAPIResponse(response);
      }

      showNotification(response?.message || UNKNOWN_ERROR);
    };

    if (query.post) {
      handleQuery('post', query.post);
    }

    if (query.user) {
      handleQuery('user', query.user);
    }
  };

  const onLoad = () => {
    const fetchPage = async () => {
      const response = await fetch('/api/posts');

      if (response?.ok) {
        return handleAPIResponse(response);
      }

      showNotification(response?.message || UNKNOWN_ERROR);
    };

    setTabs(TABS);
    fetchPage();
  };

  useEffect(
    onChangeURL,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, query]
  );

  useEffect(
    onLoad,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
      <div className={styles.logo}>
        <Image
          src="/reverse.svg"
          alt="R feather logo by ruslyeffendi3120760"
          width={40}
          height={40}
        />
      </div>
      <main className={styles.main}>
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
        <PostButton onClick={onClickPostButton} />
        <div className={styles.grid}>
          <Navigation tabs={tabs} />
          <Posts posts={posts} />
          <SignupButton onClick={onClickRegisterButton} />
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://github.com/bennyschmidt/reverse" target="_blank" rel="noreferrer">Fork on GitHub</a>
      </footer>
    </div>
  )
}
