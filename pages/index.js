import Head from 'next/head';
import Image from 'next/image';

import { useEffect, useState } from 'react';

import {
  Draft,
  Navigation,
  PostButton,
  Posts,
  Signup
} from '../components';

import styles from '../styles/Home.module.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [isDraftShown, setIsDraftShown] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      const response = await fetch('/api/posts');

      if (response?.ok) {
        const data = await response.json();

        setTabs(data.tabs);
        setPosts(data.posts);
      }
    };

    fetchPage();
  }, []);

  const onClickPostButton = () => (
    setIsDraftShown(!isDraftShown)
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Reverse</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.logo}>
        <Image
          src="/reverse.svg"
          alt="R feather logo by ruslyeffendi3120760"
          width={40}
          height={40}
        />
      </div>
      <main className={styles.main}>
        {isDraftShown && <Draft setIsDraftShown={setIsDraftShown} />}
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
