import { REVERSE_API_URL } from '../../constants';

import styles from '../../styles/Home.module.css';

const parseLinks = text => (
  text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig,
    url => (
      `<a href="${url}">${url}</a>`
    )
  )
);

export const Posts = ({ posts, profile }) => {
  const Profile = () => (
    <>
      <div className={styles.profile}>
        <div className={styles.avatar} />
        <h1>@{profile}</h1>
      </div>
    </>
  );

  return (
    <div>
      <p className={styles.description}>
        <input
          placeholder="Search"
          role="search"
          className={styles.search}
          disabled
        />
      </p>
      {profile && <Profile />}
      {
        posts.map(({ author, text, date }) => (
          <div key={text} className={styles.card}>
            <a href={`/${author}`}>{`@${author}`}</a>
            <p dangerouslySetInnerHTML={{ __html: parseLinks(text) }} />
            <a href={`/${author}`}>{date}</a>
          </div>
        ))
      }
    </div>
  );
}
