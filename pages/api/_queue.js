import { getCollection } from './_mongo';

const enqueue = async (otp, content, collectionName) => {
  const collection = await getCollection(collectionName);

  await collection.updateOne(
    { otp },
    {
      $set: {
        otp,
        content
      }
    },
    { upsert: true }
  );
};

const dequeue = async (otp, collectionName) => {
  const collection = await getCollection(collectionName);

  await collection.deleteOne({ otp });
};

const find = async (otp, collectionName) => {
  const collection = await getCollection(collectionName);

  const item = await collection.findOne({ otp });

  if (item) {
    dequeue(otp, collectionName);
  }

  return item?.content;
};

export {
  dequeue,
  enqueue,
  find
};
