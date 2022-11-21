import styles from '../../styles/Home.module.css';

const parseLinks = text => (
  text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,
    url => (
      `<a href="${url}" target="_blank">${url}</a>`
    )
  )
);

export const Posts = ({ posts }) => {
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
      {
        posts.map(({ author, text, date }) => (
          <div key={text} className={styles.card}>
            <a href="#">{`@${author}`}</a>
            <p dangerouslySetInnerHTML={{ __html: parseLinks(text) }} />
            <a href="#">{date}</a>
          </div>
        ))
      }
    </div>
  );
}
