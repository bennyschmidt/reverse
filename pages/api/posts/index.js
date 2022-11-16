import { getComments } from '../_blockchain';
import { getStaticData } from '../_data';
import { sortByDate } from '../_utils';

export default async function (req, res) {
  const { tabs } = getStaticData();

  const comments = await getComments();

  if (!tabs || !comments?.transactions) {
    res
      .status(200)
      .json({
        error: 'Error fetching data.',
        tabs: [],
        posts: []
      });

    return;
  }

  const posts = sortByDate(comments.transactions);

  res
    .status(200)
    .json({
      tabs,
      posts
    });
}
