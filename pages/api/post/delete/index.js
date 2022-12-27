import { getCollection } from '../../_mongo';
import { getSession } from '../../_session';
import { getUsers } from '../../_blockchain';

export default async function (req, res) {
  const { postId, token } = req.body;

  const session = await getSession(token);

  const users = await getUsers();

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

  const collection = await getCollection('deleted');

  await collection.updateOne(
    { postId },
    {
      $set: {
        postId
      }
    },
    { upsert: true }
  );

  res
    .status(200)
    .json({
      status: 200,
      ok: true,
      message: 'Post deleted.'
    });
}
