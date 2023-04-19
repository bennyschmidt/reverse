import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import {
  Auth,
  Draft,
  Logo,
  Navigation,
  Overlay,
  PostButton,
  Posts,
  Register
} from '../components';

import { UNKNOWN_ERROR } from '../constants';

import styles from '../styles/Home.module.css';

export default function Home ({
  handleAPIResponse,
  showNotification,
  state
}) {
  const router = useRouter();

  const [user, setUser] = useState();
  const [isDraftShown, setIsDraftShown] = useState(false);
  const [isRegisterShown, setIsRegisterShown] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const { pathname, query } = router;
  const { posts, tabs } = state;

  const onClickPostButton = () => (
    setIsDraftShown(true)
  );

  const onClickRegisterButton = () => (
    setIsRegisterShown(true)
  );

  const onClickLoginButton = async addressOrEmail => {
    const isAddress = addressOrEmail.length === 36;
    const isEmail = (/^[a-z0-9_\-.]{1,64}@[a-z0-9_\-.]{1,64}$/i.test(addressOrEmail));

    if (isAddress || isEmail) {
      setIsFetching(true);

      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [isAddress ? 'address' : 'email']: addressOrEmail
        })
      });

      setIsFetching(false);

      if (response?.ok) {
        const { message } = await response.json();

        showNotification(message);
      }
    }
  };

  const onAuthQuery = async ({ address, token }) => {
    setIsFetching(true);

    const response = await fetch('/api/auth/confirm', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address,
        token
      })
    });

    if (response?.ok) {
      const result = await response.json();

      router.replace(
        pathname,
        undefined,
        { shallow: true }
      );

      setIsFetching(false);
      setUser(result.user);

      localStorage.setItem('user', JSON.stringify({
        address,
        token
      }));

      return;
    }

    localStorage.clear();
    setUser(null);
    setIsFetching(false);
  };

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
        return handleAPIResponse(response);
      }

      showNotification(response?.message || UNKNOWN_ERROR);
    };

    if (query.user) {
      handleQuery('user', query.user);

      router.replace(
        pathname,
        undefined,
        { shallow: true }
      );
    }

    if (query.address && query.token) {
      onAuthQuery({
        address: query.address,
        token: query.token
      });
    }
  };

  const onLoad = () => {
    const fetchPage = async () => {
      setIsFetching(true);

      const response = await fetch('/api/posts');

      setIsFetching(false);

      if (response?.ok) {
        return handleAPIResponse(response);
      }

      showNotification(response?.message || UNKNOWN_ERROR);
    };

    const fetchUser = async () => {
      const cachedUser = JSON.parse(
        localStorage.getItem('user') || '{}'
      );

      if (cachedUser) {
        setIsFetching(true);

        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            address: cachedUser.address,
            token: cachedUser.token
          })
        });

        if (response?.ok) {
          const result = await response.json();

          setUser(result.user);
          setIsFetching(false);

          return;
        }

        localStorage.clear();
        setUser(null);
        setIsFetching(false);
      }
    };

    if (!user) {
      fetchUser();
    }

    fetchPage();
  };

  useEffect(
    onChangeURL,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, query, onAuthQuery]
  );

  useEffect(
    onLoad,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const overlayProps = {
    isDraftShown,
    setIsDraftShown,
    isRegisterShown,
    setIsRegisterShown,
    setIsFetching,
    handleAPIResponse,
    showNotification,
    user
  };

  return (
    <>
      <Logo />
      <main className={styles.main}>
        <Overlay {...overlayProps} />
        {user && <PostButton disabled={isFetching} onClick={onClickPostButton} />}
        <div className={styles.grid}>
          <Navigation tabs={tabs} />
          <Posts posts={posts} />
          {!user && <Auth
            onClickSignUp={onClickRegisterButton}
            onClickSignIn={onClickLoginButton}
            isFetching={isFetching}
          />}
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://github.com/bennyschmidt/reverse" target="_blank" rel="noreferrer">
          Fork on GitHub
        </a>
      </footer>
    </>
  );
}
