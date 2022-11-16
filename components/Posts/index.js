import styles from '../../styles/Home.module.css';

export const Posts = ({ posts }) => (
  <div>
    <p className={styles.description}>
      <input
        placeholder="Search"
        role="search"
        className={styles.search}
        disabled
      />
    </p>
    {
      posts.map(({ author, text, date }) => (
        <div key={text} className={styles.card}>
          <a href="#">{`@${author}`}</a>
          <p>{text}</p>
          <a href="#">{date}</a>
        </div>
      ))
    }
  </div>
);
