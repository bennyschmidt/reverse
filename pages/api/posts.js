export default function posts(req, res) {
  const tabs = [
    {
      text: 'Posts',
      href: '/'
    },
    {
      text: 'Settings',
      href: '/settings'
    }
  ];

  const posts = [
    {
      authorName: 'benny',
      text: 'Hello world!',
      date: '11/11/2022, 9:20:17 AM'
    },
    {
      authorName: 'benny',
      text: 'Testing #hashtags',
      date: '11/11/2022, 9:20:18 AM'
    },
    {
      authorName: 'benny',
      text: 'And @mentions...',
      date: '11/11/2022, 9:20:19 AM'
    }
  ];

  res
    .status(200)
    .json({
      tabs,
      posts: posts.reverse()
    });
}
