import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import {
  Draft,
  Logo,
  Navigation,
  Overlay,
  PostButton,
  Posts,
  Register,
  SignupButton
} from '../components';

import { UNKNOWN_ERROR } from '../constants';

import styles from '../styles/Home.module.css';

export default function Home ({
  handleAPIResponse,
  showNotification,
  state
}) {
  const router = useRouter();

  const [isDraftShown, setIsDraftShown] = useState(false);
  const [isRegisterShown, setIsRegisterShown] = useState(false);

  const { pathname, query } = router;
  const { posts, tabs } = state;

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

  const overlayProps = {
    isDraftShown,
    setIsDraftShown,
    isRegisterShown,
    setIsRegisterShown,
    handleAPIResponse,
    showNotification
  };

  return (
    <>
      <Logo />
      <main className={styles.main}>
        <Overlay {...overlayProps} />
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
    </>
  );
}
