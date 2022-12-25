/* eslint-disable no-magic-numbers */

const { getUsers } = require('../../_blockchain');
const { getSession } = require('../../_session');

module.exports = async (req, res) => {
  const { address, token = '' } = req.body;

  if (!address || !token) {
    return res
      .status(400)
      .json({
        status: 400,
        ok: false,
        message: 'Bad request.'
      });
  }

  const session = await getSession(token);

  if (!session?.address || session.address !== address) {
    return res
      .status(401)
      .json({
        status: 401,
        ok: false,
        message: 'Unauthorized.'
      });
  }

  const { transactions } = await getUsers();

  const result = transactions.find(user => user.address === address);

  const { username } = result;

  if (!username) {
    return res
      .status(404)
      .json({
        status: 404,
        ok: false,
        message: 'User not found.'
      });
  }

  const user = {
    token,
    username,
    userData: {
      username,
      address: result.address
    }
  };

  return res
    .status(200)
    .json({
      status: 200,
      ok: true,
      user
    });
};
