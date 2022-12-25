import styles from '../../styles/Home.module.css';

export const PostButton = ({ onClick, disabled }) => (
  <p className={styles.description}>
    <button
      className={styles.post}
      onClick={onClick}
      disabled={disabled}
    >
      &#9998;
    </button>
  </p>
);
