import { v4 as uuidv4 } from 'uuid';

import styles from '../../styles/Home.module.css';

const DOMRef = {};

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

const parseLink = async (text, url) => {
  let link = (
    `<span class=${styles.preview}><a href="${url}" target="_blank">${url}</a></span>`
  );

  try {
    const response = await fetch(url);

    if (!response?.ok) {
      return link;
    }

    const result = await response.text();

    const shadowDocument = new DOMParser().parseFromString(result, 'text/html');

    const title = (
      shadowDocument?.querySelector('title')?.innerText ||
      url.replace(/https?:\/\//, '')
    );

    let imageSrc = (
      shadowDocument?.querySelector('img')?.getAttribute('src')
    ) || '';

    const firstTwo = imageSrc.substring(0, 2);
    const first = imageSrc.charAt(0);
    const cleanURL = url.split('?')[0];

    if (firstTwo === '..') {
      imageSrc = (
        `${cleanURL.substring(0, cleanURL.lastIndexOf('/'))}${imageSrc.substring(2)}`
      );
    } else if (first === '.') {
      const separator = firstTwo === './' ? '' : '/';

      imageSrc = (
        `${cleanURL}${separator}${imageSrc.substring(1 + (separator ? 1 : 0))}`
      );
    } else if (first === '/') {
      imageSrc = `${cleanURL.split('/')[2]}${imageSrc}`;
    }

    const isWebImage = imageSrc.substring(0, 4) === 'http';
    const contentPreviewAttrs = 'width="100%" height="100%"';

    link = (
      `<span class=${styles.preview}>${
        title
      }${
        isWebImage
          ? `<img src="${imageSrc}" alt="${title}" ${contentPreviewAttrs} />`
          : `<span class=${styles.placeholder} ${contentPreviewAttrs}></span>`
      }</span>`
    );
  } catch (error) {}

  requestAnimationFrame(() => {
    const preview = document.getElementById(DOMRef[url]);

    if (preview) {
      preview.innerHTML = link;
    }
  });

  return link;
};

const parseLinks = text => (
  text.match(/(https?|ftp|file)/ig)
    ? (
        text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig,
        url => {
          DOMRef[url] = `Text-${uuidv4()}`;

          return url.match(/youtube.com|youtu.be/)
            ? parseYouTubeEmbed(url)
            : url.match('odysee.com')
              ? parseOdyseeEmbed(url)
              : (
                parseLink(text.replace(url, ''), url) &&
                `<a href="${url}" target="_blank" id="${DOMRef[url]}">${url}</a>`
              )
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
