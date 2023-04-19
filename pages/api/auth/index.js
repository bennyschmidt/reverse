/* eslint-disable no-magic-numbers */

const { HOST } = process.env;

const { v4: uuidv4 } = require('uuid');

const { getUsers } = require('../_blockchain');
const { sendEmail } = require('../_mailer');
const { addSession, getSession } = require('../_session');

module.exports = async (req, res) => {
  const {
    address = '',
    email = '',
    token = ''
  } = req.body;

  const isAddress = address.length === 36;
  const isEmail = (/^[a-z0-9_\-.]{1,64}@[a-z0-9_\-.]{1,64}$/i.test(email));

  if (!isAddress && !isEmail) {
    return res
      .status(400)
      .json({
        status: 400,
        ok: false,
        message: 'Bad request.'
      });
  }

  const { transactions } = await getUsers();

  const result = transactions.find(user => (
    isAddress
      ? user.address === address
      : user.email === email
  ));

  if (!result?.email) {
    return res
      .status(404)
      .json({
        status: 404,
        ok: false,
        message: 'User not found.'
      });
  }

  if (token) {
    const session = await getSession(token);

    if (session?.address === address) {
      const { username } = result;

      const user = {
        token,
        username,
        userData: {
          username,
          address: session.address
        }
      };

      return res
        .status(200)
        .json({
          status: 200,
          ok: true,
          user
        });
    }

    return res
      .status(401)
      .json({
        status: 401,
        ok: false,
        message: 'Unauthorized.'
      });
  } else {
    const sessionToken = uuidv4();

    await addSession(sessionToken, result.address);

    await sendEmail({
      to: result.email,
      subject: 'Confirm your login on Reverse.',
      // eslint-disable-next-line max-len
      html: `<a href="${HOST}/?address=${result.address}&token=${sessionToken}" target="_blank">Authorize Login</a><br />If you do not authorize this login, <strong>do not</strong> click the link.`
    });

    res
      .status(200)
      .json({
        status: 200,
        ok: true,
        message: 'Authorization sent (check your email).'
      });
  }
};
