const transactions = [];

const getData = () => ({
  transactions
});

const create = transaction => (
  transactions.push(transaction)
);

export {
  getData,
  create
};
