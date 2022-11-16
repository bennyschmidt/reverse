const {
  MAIL_NAME,
  DEREVA_API_KEY,
  DEREVA_ADDRESS,
  DEREVA_URI
} = process.env;

const fetchNonFungibleRecord = async ({
  mediaAddress,
  mediaType = 'json'
}) => (
  fetch(
    `${DEREVA_URI}/file`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mediaAddress,
        mediaType
      })
    }
  )
);

const getUsers = async () => {
  const users = [];

  const transactions = await fetch(`${DEREVA_URI}/transactions`);

  if (!transactions?.ok) return;

  const result = await transactions.json();

  await Promise.all(result.body
    .filter(({ contract }) => contract === 'DRV200')
    .map(async transaction => {
      if (!transaction.drvValue.match(/drv\/user/)) return;

      const mediaAddress = transaction.drvValue
        .replace('::magnet:?xt=urn:drv/user:', '')
        .replace('&dn=User', '');

      const user = await fetchNonFungibleRecord({ mediaAddress });

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

  const transactions = await fetch(`${DEREVA_URI}/transactions`);

  if (!transactions?.ok) return;

  const result = await transactions.json();

  await Promise.all(result.body
    .filter(({ contract }) => contract === 'DRV200')
    .map(async transaction => {
      if (!transaction.drvValue.match(/drv\/comment/)) return;

      const mediaAddress = transaction.drvValue
        .replace('::magnet:?xt=urn:drv/comment:', '')
        .replace('&dn=Comment', '');

      const comment = await fetchNonFungibleRecord({ mediaAddress });

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
    transactions: comments
  };
};

const create = async transaction => (
  fetch(`${DEREVA_URI}/transaction`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      apiKey: DEREVA_API_KEY,
      username: MAIL_NAME,
      recipient: MAIL_NAME,
      recipientAddress: DEREVA_ADDRESS,
      usdValue: 0,
      drvValue: `data:drv/${transaction.type.toLowerCase()};json,${JSON.stringify(transaction)}`,
      contract: 'DRV200'
    })
  })
);

export {
  getComments,
  getUsers,
  create
};
