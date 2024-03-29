import { generateUUID } from 'cryptography-utilities';

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
            ? parseYouTubeEmbed(url.split('&')[0])
            : url.match('odysee.com')
              ? parseOdyseeEmbed(url)
              : `<span class=${styles.preview}><a href="${url}" target="_blank">${url}</a></span>`
        })
      )
    : parseMentions(text)
  );

export const Posts = ({
  posts,
  profile,
  user,
  onDeletePost = () => null
}) => {
  const Profile = () => (
    <>
      <div className={styles.profile}>
        <div className={styles.avatar} />
        <h1>@{profile}</h1>
      </div>
    </>
  );

  const isProfileUser = user && user.username === profile;

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
        posts.slice(0, PAGE_LIMIT).map(({ id, author, text, date }) => {
          const localDateTime = (
            new Date(date).toLocaleString()
          );

          return (
            <div key={generateUUID()} className={styles.card}>
              <a href={`/${author}`}>{`@${author}`}</a>
              <p dangerouslySetInnerHTML={{ __html: parseLinks(text) }} />
              <div className={styles.info}>
                <a href={`/${author}`}>{localDateTime}</a>
                {isProfileUser && <button onClick={onDeletePost(id)}>Delete</button>}
              </div>
            </div>
          );
        })
      }
    </div>
  );
}
