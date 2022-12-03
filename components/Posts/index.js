import styles from '../../styles/Home.module.css';

const createIFrame = src => (
  `<iframe width="100%" height="360px" src="${src}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope;"></iframe>`
);

const parseOdyseeEmbed = url => createIFrame(url.replace('.com', '.com/$/embed'));

const parseYouTubeEmbed = url => url.replace(
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g,
  createIFrame('https://www.youtube-nocookie.com/embed/$1')
);

const parseMentions = text => (
  text.replace(/@[0-9a-z](\.?[0-9a-z])*/g, mention => (
    `<a href="${mention.substring(1)}">${mention}</a>`
  ))
);

const parseLinks = text => (
  text.match(/(https?|ftp|file)/ig)
    ? (
        text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig,
        url => (
          url.match(/youtube.com|youtu.be/)
            ? parseYouTubeEmbed(url)
            : url.match('odysee.com')
              ? parseOdyseeEmbed(url)
              : `<a href="${url}" target="_blank">${url}</a>`
        ))
      )
    : parseMentions(text)
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
