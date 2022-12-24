import { request } from './_utils';

const {
  DEREVA_API_KEY,
  DEREVA_ADDRESS,
  DEREVA_URI
} = process.env;

const FS_URI = `${DEREVA_URI}/file`;
const TRANSACTION_URI = `${DEREVA_URI}/transaction`;
const TRANSACTIONS_URI = `${TRANSACTION_URI}s`;
const LIMIT = 200;

const getUsers = async () => {
  const users = [];

  const transactions = await fetch(TRANSACTIONS_URI);

  if (!transactions?.ok) return;

  const result = await transactions.json();

  await Promise.all(result.body
    .filter(({ contract }) => contract === 'DRV201')
    .map(async transaction => {
      if (!transaction.drvValue.match(/drv\/user/)) return;

      const mediaAddress = transaction.drvValue
        .replace('::magnet:?xt=urn:drv/user:', '')
        .replace('&dn=User', '');

      const user = await request(FS_URI, {
        mediaAddress,
        mediaType: 'json'
      });

      if (!user?.ok) return;

      const { body } = await user.json();

      const {
        username,
        email,
        date
      } = JSON.parse(body);

      users.push({
        username,
        email,
        date
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
        date
      } = JSON.parse(body);

      comments.push({
        author,
        text,
        date
      });
    })
  );

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
    senderAddress: DEREVA_ADDRESS,
    recipientAddress: DEREVA_ADDRESS,
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
    transaction: {
      ...content,

      unique: content.username
    },

    contract: 'DRV201'
  })
);

export {
  getComments,
  getCommentsByUsername,
  getUsers,
  createComment,
  createUser
};
