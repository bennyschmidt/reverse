import styles from '../../styles/Home.module.css';

export const PostButton = ({ onClick }) => (
  <p className={styles.description}>
    <button
      className={styles.post}
      onClick={onClick}
    >
      &#9998;
    </button>
  </p>
);
