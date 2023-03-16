import { request } from './_utils';
import { getCollection } from './_mongo';

const {
  DEREVA_API_KEY,
  DEREVA_ADDRESS,
  DEREVA_URI
} = process.env;

const FS_URI = `${DEREVA_URI}/file`;
const TRANSACTION_URI = `${DEREVA_URI}/transaction`;
const TRANSACTIONS_URI = `${TRANSACTION_URI}s`;
const LIMIT = 1000;

const getUsers = async () => {
  const users = [];

  const transactions = await fetch(TRANSACTIONS_URI);

  if (!transactions?.ok) return;

  const result = await transactions.json();

  await Promise.all(result.body
    .filter(({ contract }) => contract === 'DRV200')
    .map(async transaction => {
      if (!transaction.drvValue.match(/drv\/alias/)) return;

      const mediaAddress = transaction.drvValue
        .replace('::magnet:?xt=urn:drv/alias:', '')
        .replace('&dn=Alias', '');

      const user = await request(FS_URI, {
        mediaAddress,
        mediaType: 'json'
      });

      if (!user?.ok) return;

      const { body } = await user.json();

      const {
        address,
        name,
        auth: {
          value: email
        },
        datetime
      } = JSON.parse(body);

      users.push({
        address,
        username: name,
        email,
        date: datetime
      });
    })
  );

  return {
    transactions: users
  };
};

const getComments = async () => {
  const comments = [];

  const transactions = await fetch(TRANSACTIONS_URI);

  if (!transactions?.ok) return;

  const result = await transactions.json();

  await Promise.all(result.body
    .filter(({ contract }) => contract === 'DRV200')
    .map(async transaction => {
      if (!transaction.drvValue.match(/drv\/comment/)) return;

      const mediaAddress = transaction.drvValue
        .replace('::magnet:?xt=urn:drv/comment:', '')
        .replace('&dn=Comment', '');

      const comment = await request(FS_URI, {
        mediaAddress,
        mediaType: 'json'
      });

      if (!comment?.ok) return;

      const { body } = await comment.json();

      const {
        author,
        text,
        datetime
      } = JSON.parse(body);

      comments.push({
        id: transaction.hash,
        author,
        text,
        date: datetime
      });
    })
  );

  const collection = await getCollection('deleted');
  const deletedPosts = await collection.find().toArray();

  for (const deleted of deletedPosts) {
    comments.splice(
      comments.indexOf(
        comments.find(({ id }) => id === deleted.postId)
      ),
      1
    );
  }

  return {
    transactions: comments.slice(-LIMIT)
  };
};

const getCommentsByUsername = async username => {
  const comments = await getComments();

  const userComments = comments.transactions
    .filter(({ author }) => author === username)

  return {
    transactions: userComments.slice(-LIMIT)
  };
};

const create = async ({
  transaction = {},
  contract = 'DRV200'
}) => (
  request(TRANSACTION_URI, {
    apiKey: DEREVA_API_KEY,

    /**
     * The platform/host is set to "own" the content by default
     * (the new record is minted by, and transferred to DEREVA_ADDRESS).
     *
     * For users to own their content, at least recipientAddress should
     * be set as the address of the content creator.
     *
     * To officialize content while preserving user ownership,
     * the platform/host can serve as a content mint (senderAddress),
     * that transfers ownership to the content creator (recipientAddress).
     * Alternatively, both senderAddress & recipientAddress can be the content
     * creator's address, if it's important to show that they minted, or
     * originated it.
     **/

    senderAddress: DEREVA_ADDRESS,
    recipientAddress: DEREVA_ADDRESS,

    /**
     * usdValue doesn't matter for non-fungible records, but it can be used
     * as metadata, to associate the post with some price, fee, sale, etc.
     **/

    usdValue: 0,
    drvValue: `data:drv/${transaction.type.toLowerCase()};json,${JSON.stringify(transaction)}`,
    contract
  })
);

const createComment = async content => (
  create({
    transaction: content
  })
);

const createUser = async content => (
  create({
    transaction: content
  })
);

export {
  getComments,
  getCommentsByUsername,
  getUsers,
  createComment,
  createUser
};
