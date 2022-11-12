import styles from '../../styles/Home.module.css';

export const Navigation = ({ tabs }) => (
  <div className={styles.sidebar}>
    {
      tabs.map(({ text, href }) => (
        <div
          key={text}
          className={styles[`tab${href === window.location.pathname ? '-active' : ''}`]}
        >
          <a href={href}>{text}</a>
        </div>
      ))
    }
  </div>
);
