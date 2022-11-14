import { getData } from '../_blockchain';
import { getStaticData } from '../_data';
import { sortByDate } from '../_utils';

export default function (req, res) {
  const { tabs } = getStaticData();
  const { transactions } = getData();

  if (!tabs || !transactions) {
    res
      .status(200)
      .json({
        error: 'Error fetching data.',
        tabs: [],
        posts: []
      });

    return;
  }

  const posts = sortByDate(
    transactions.filter(({ type }) => type === 'Comment')
  );

  res
    .status(200)
    .json({
      tabs,
      posts
    });
}
