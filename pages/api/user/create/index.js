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

  const payload = req.body;
  const posts = sortByDate(comments.transactions);

  const {
    email = '',
    username = ''
  } = payload;

  const invalidParam = (
    !(/^[a-z0-9_\-.]{1,64}@[a-z0-9_\-.]{1,64}$/i.test(email))
      ? 'email address'
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

  if (users.transactions.find(user => user.username === username)) {
    res
      .status(200)
      .json({
        status: 401,
        ok: false,
        message: 'That username is taken.',
        posts
      });

    return;
  }

  const otp = uuidv4();

  await sendEmail({
    to: email,
    subject: 'Confirm your email on Reverse.',
    html: `<a href="${HOST}?user=${otp}" target="_blank">Register "${username}"</a><br />If you do not authorize this, <strong>do not</strong> click the link.`
  });

  // Formatted UTC (MM/DD/YYYY, hh:mm:ss)

  const date = new Date()
    .toISOString()
    .replace('T', ' ')
    .substr(0, 19)
    .replace(/-/g, '/');

  const content = {
    type: 'User',
    username,
    email,
    date
  };

  await enqueue(otp, content, 'users');

  setTimeout(() => dequeue(otp, 'users'), OTP_EXPIRATION);

  res
    .status(200)
    .json({
      status: 200,
      ok: true,
      message: 'Authorization sent (check your email).',
      posts
    });
}
