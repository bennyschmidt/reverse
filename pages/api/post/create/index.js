const {
  OTP_EXPIRATION
} = process.env;

import { getComments, getUsers } from '../../_blockchain';
import { getStaticData, dequeue, enqueue } from '../../_data';
import { sortByDate } from '../../_utils';

import {
  validateEmailAddress,
  sendEmail
} from '../../_mailer.js';

export default async function (req, res) {
  const { tabs } = getStaticData();

  const comments = await getComments();

  const users = await getUsers();

  if (!tabs || !comments?.transactions || !users?.transactions) {
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
  const text = payload.post.trim();

  if (!text || text.length < 2 || text.length > 280) {
    res
      .status(200)
      .json({
        isError: true,
        message: 'Posts must be 2-280 characters in length.',
        tabs,
        posts
      });

    return;
  }

  const { username } = payload;
  const user = users.transactions.find(user => user.username === username);

  if (!user) {
    res
      .status(200)
      .json({
        isError: true,
        message: 'User not found.',
        tabs,
        posts
      });

    return;
  }

  const { email } = user;

  // TODO: Generate secure OTP
  const otp = 'test-12345678-aaaa-bbbb-ccccdddd';

  await sendEmail({
    to: email,
    subject: 'Confirm your post on Reverse.',
    html: `<a href="http://localhost:3000?post=${otp}" target="_blank">Authorize Post</a><br />If you do not authorize this post, <strong>do not</strong> click the link.`
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
      message: 'Authorization sent (check your email).',
      tabs,
      posts
    });
}
