import styles from '../../styles/Home.module.css';

export const SignupButton = ({ onClick }) => (
  <div className={styles.cta}>
    <h3>
      New to Reverse?
    </h3>
    <button onClick={onClick}>
      Sign up with email
    </button>
  </div>
);
