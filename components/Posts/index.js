import { v4 as uuidv4 } from 'uuid';

import styles from '../../styles/Home.module.css';

const PAGE_LIMIT = 25;

const createIFramePreview = src => (
  `<span class=${styles.preview}>
    <iframe width="100%" height="360px" src="${src}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope;"></iframe>
  </span>`
);

const parseOdyseeEmbed = url => createIFramePreview(url.replace('.com', '.com/$/embed'));

const parseYouTubeEmbed = url => url.replace(
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g,
  createIFramePreview('https://www.youtube-nocookie.com/embed/$1')
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
        url => {
          return url.match(/youtube.com|youtu.be/)
            ? parseYouTubeEmbed(url)
            : url.match('odysee.com')
              ? parseOdyseeEmbed(url)
              : `<span class=${styles.preview}><a href="${url}" target="_blank">${url}</a></span>`
        })
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
        posts.slice(0, PAGE_LIMIT).map(({ author, text, date }) => {
          const localDateTime = (
            new Date(`${date} UTC`).toLocaleString()
          );

          return (
            <div key={text} className={styles.card}>
              <a href={`/${author}`}>{`@${author}`}</a>
              <p dangerouslySetInnerHTML={{ __html: parseLinks(text) }} />
              <a href={`/${author}`}>{localDateTime}</a>
            </div>
          );
        })
      }
    </div>
  );
}
