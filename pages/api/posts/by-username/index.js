/* eslint-disable no-magic-numbers */

const { getCommentsByUsername } = require('../../_blockchain');
const { sortByDate } = require('../../_utils');

module.exports = async (req, res) => {
  const {
    username = ''
  } = req.body;

  if (!username) {
    res
      .status(200)
      .json({
        status: 400,
        ok: false,
        error: 'Invalid username.',
        posts: []
      });
  }

  const comments = await getCommentsByUsername(username);

  if (!comments?.transactions) {
    res
      .status(200)
      .json({
        status: 500,
        ok: false,
        error: 'Error fetching data.',
        posts: []
      });
  }

  const posts = sortByDate(comments.transactions);

  res
    .status(200)
    .json({
      status: 200,
      ok: true,
      posts
    });
};
