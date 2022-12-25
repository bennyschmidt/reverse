import { getCollection } from './_mongo';

const COLLECTION_NAME = 'sessions';

const addSession = async (token, data) => {
  const collection = await getCollection(COLLECTION_NAME);

  await collection.updateOne(
    { token },
    {
      $set: {
        token,
        data
      }
    },
    { upsert: true }
  );
};

const removeSession = async token => {
  const collection = await getCollection(COLLECTION_NAME);

  await collection.deleteOne({ token });
};

const getSession = async token => {
  const collection = await getCollection(COLLECTION_NAME);

  const item = await collection.findOne({ token });

  return {
    address: item?.data
  };
};

export {
  addSession,
  getSession,
  removeSession
};
