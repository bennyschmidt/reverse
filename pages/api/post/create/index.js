const {
  HOST,
  OTP_EXPIRATION
} = process.env;

import { v4 as uuidv4 } from 'uuid';

import {
  getComments,
  getUsers,
  createComment
} from '../../_blockchain';

import { getSession } from '../../_session';
import { sortByDate } from '../../_utils';

import {
  validateEmailAddress,
  sendEmail
} from '../../_mailer.js';

export default async function (req, res) {
  const comments = await getComments();

  const users = await getUsers();

  if (!comments?.transactions || !users?.transactions) {
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

  const {
    token = '',
    post = ''
  } = req.body;

  const session = await getSession(token);

  const user = users.transactions.find(user => user.address === session.address);

  if (!user?.address) {
    return res
      .status(401)
      .json({
        status: 401,
        ok: false,
        message: 'Unauthorized.'
      });
  }

  const posts = sortByDate(comments.transactions);

  // Remove leading/trailing spaces & any HTML

  const text = post
    .trim()
    .replace(/<[^>]*>?/gm, '');

  // Validate length & format

  const invalidParam = (
    !(/^.{2,280}$/i.test(text))
      ? 'post format'
      : false
  );

  if (invalidParam) {
    res
      .status(200)
      .json({
        status: 400,
        ok: false,
        message: `Invalid ${invalidParam}.`,
        posts
      });

    return;
  }

  // Formatted UTC (MM/DD/YYYY, hh:mm:ss)

  const datetime = new Date().toISOString();

  const content = {
    type: 'Comment',
    author: user.username,
    text,
    datetime
  };

  await createComment(content);

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
