const {
  HOST,
  OTP_EXPIRATION
} = process.env;

import { v4 as uuidv4 } from 'uuid';

import { getComments } from '../../_blockchain';
import { getStaticData, dequeue, enqueue } from '../../_data';
import { sortByDate } from '../../_utils';

import {
  validateEmailAddress,
  sendEmail
} from '../../_mailer.js';

export default async function (req, res) {
  const { tabs } = getStaticData();

  const comments = await getComments();

  if (!tabs || !comments?.transactions) {
    res
      .status(200)
      .json({
        isError: true,
        message: 'Error fetching data.',
        tabs: [],
        posts: []
      });

    return;
  }

  const payload = JSON.parse(req.body);
  const posts = sortByDate(comments.transactions);

  // TODO: Validate `email` & `username`
  const { email, username } = payload;

  const otp = uuidv4();

  await sendEmail({
    to: email,
    subject: 'Confirm your email on Reverse.',
    html: `<a href="${HOST}?user=${otp}" target="_blank">Register "${username}"</a><br />If you do not authorize this, <strong>do not</strong> click the link.`
  });

  setTimeout(() => dequeue(otp, 'users'), OTP_EXPIRATION);

  const content = {
    type: 'User',
    username,
    email,
    date: new Date().toLocaleString()
  };

  await enqueue(otp, content, 'users');

  res
    .status(200)
    .json({
      message: 'Authorization sent (check your email).',
      tabs,
      posts
    });
}
