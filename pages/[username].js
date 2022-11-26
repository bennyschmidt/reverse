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

export default function UserProfile ({
  handleAPIResponse,
  showNotification,
  state
}) {
  const router = useRouter();

  const [profile, setProfile] = useState();
  const [isDraftShown, setIsDraftShown] = useState(false);
  const [isRegisterShown, setIsRegisterShown] = useState(false);

  const { query = {} } = router;
  const { posts, tabs } = state;

  const onClickPostButton = () => (
    setIsDraftShown(true)
  );

  const onClickRegisterButton = () => (
    setIsRegisterShown(true)
  );

  const onLoad = () => {
    const { username } = query;

    if (profile !== username) {
      const fetchProfile = async () => {
        const response = await fetch('/api/posts/by-username', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username
          })
        });

        if (response?.ok) {
          return handleAPIResponse(response);
        }

        showNotification(response?.message || UNKNOWN_ERROR);
      };

      fetchProfile(username);
      setProfile(username);
    }
  };

  useEffect(
    onLoad,

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query]
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
          <Posts posts={posts} profile={profile} />
          <SignupButton onClick={onClickRegisterButton} />
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://github.com/bennyschmidt/reverse" target="_blank" rel="noreferrer">Fork on GitHub</a>
      </footer>
    </>
  );
}
