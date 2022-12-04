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

const parseLink = async (text, url) => {
  let link = `<a href="${url}" target="_blank">${url}</a>`;

  try {
    const response = await fetch(url);

    if (response?.ok) {
      const result = await response.text();

      const shadowDocument = new DOMParser().parseFromString(result, 'text/html');

      const title = (
        shadowDocument?.querySelector('title')?.innerText ||
        url.replace(/https?:\/\//, '')
      );

      let imageSrc = (
        shadowDocument?.querySelector('img')?.getAttribute('src')
      );

      if (!imageSrc.substring(0, 8).match(/https?:\/\//)) {
        imageSrc = `https://${url.split('/')[2]}${imageSrc.replace(/\.\./g, '')}`;
      }

      link = (
        `<span class=${styles.preview}>${title}${
          imageSrc
            ? `<img src=${imageSrc} alt=${title} width="100%" height="100%" />`
            : ''
        }</span>`
      );

      requestAnimationFrame(() => {
        const preview = document.querySelector(`#${text.replace(/[\W_]+/g, '')}`);

        if (preview) {
          preview.innerHTML = link;
        }
      });
    }
  } catch (error) {
    console.warn(error);
  }

  return link;
};

const parseLinks = text => {
  return (
    text.match(/(https?|ftp|file)/ig)
      ? (
          text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig,
          url => (
            url.match(/youtube.com|youtu.be/)
              ? parseYouTubeEmbed(url)
              : url.match('odysee.com')
                ? parseOdyseeEmbed(url)
                : parseLink(text.replace(url, ''), url) && (
                  `<a href="${url}" target="_blank" id="${text.replace(url, '').replace(/[\W_]+/g, '')}">${url}</a>`
                )
          ))
        )
      : parseMentions(text)
    );
};

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
