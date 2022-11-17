import { getComments, create } from '../../../_blockchain';
import { find } from '../../../_queue';
import { sortByDate } from '../../../_utils';

export default async function (req, res) {
  const comments = await getComments();

  if (!comments?.transactions) {
    res
      .status(200)
      .json({
        status: 500,
        ok: false,
        message: 'Error fetching data.',
        posts: []
      });

    return;
  }

  const posts = sortByDate(comments.transactions);
  const { otp } = req.body;

  const content = await find(otp, 'posts');

  if (!content) {
    res
      .status(200)
      .json({
        status: 401,
        ok: false,
        message: 'Invalid one-time password.',
        posts
      });

    return;
  }

  create(content);

  res
    .status(200)
    .json({
      status: 200,
      ok: true,
      message: 'Post successful! Sharing with peers...',
      posts: [
        content,

        ...posts
      ]
    });
}
