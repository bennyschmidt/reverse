const {
  HOST,
  OTP_EXPIRATION
} = process.env;

import { v4 as uuidv4 } from 'uuid';

import { getComments, getUsers } from '../../_blockchain';
import { dequeue, enqueue } from '../../_queue';
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

  const payload = req.body;
  const posts = sortByDate(comments.transactions);

  const {
    username = '',
    post = ''
  } = payload;

  const text = post.trim();

  const invalidParam = (
    !(/^.{2,280}$/i.test(text))
      ? 'post format'
      : !(/^[a-z0-9_.]{2,16}$/i.test(username))
        ? 'username'
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

  const user = users.transactions.find(user => user.username === username);

  if (!user) {
    res
      .status(200)
      .json({
        status: 404,
        ok: false,
        message: 'User not found.',
        posts
      });

    return;
  }

  const { email } = user;

  const otp = uuidv4();

  await sendEmail({
    to: email,
    subject: 'Confirm your post on Reverse.',
    html: `<a href="${HOST}?post=${otp}" target="_blank">Authorize Post</a><br />If you do not authorize this post, <strong>do not</strong> click the link.`
  });

  setTimeout(() => dequeue(otp, 'posts'), OTP_EXPIRATION);

  const content = {
    type: 'Comment',
    author: username,
    text,
    date: new Date().toLocaleString()
  };

  await enqueue(otp, content, 'posts');

  res
    .status(200)
    .json({
      status: 200,
      ok: true,
      message: 'Authorization sent (check your email).',
      posts
    });
}
