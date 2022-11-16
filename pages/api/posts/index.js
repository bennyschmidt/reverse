import { getComments } from '../_blockchain';
import { sortByDate } from '../_utils';

export default async function (req, res) {
  const comments = await getComments();

  if (!comments?.transactions) {
    res
      .status(200)
      .json({
        status: 500,
        ok: false,
        error: 'Error fetching data.',
        posts: []
      });

    return;
  }

  const posts = sortByDate(comments.transactions);

  res
    .status(200)
    .json({
      status: 200,
      ok: true,
      posts
    });
}
