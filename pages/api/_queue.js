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

  return item?.content;
};

const findAndDequeue = async (otp, collectionName) => {
  const content = await find(otp, collectionName);

  if (content) {
    dequeue(otp, collectionName);
  }

  return content;
};

export {
  dequeue,
  enqueue,
  find,
  findAndDequeue
};
