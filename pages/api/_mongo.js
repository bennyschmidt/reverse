const {
  DB_NAME,
  MONGO_URI
} = process.env;

import { MongoClient } from 'mongodb';

let client = null;

const getDatabase = async () => {
  if (!client) {
    client = await MongoClient.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  return client.db(DB_NAME);
};

const getCollection = async name => {
  const db = await getDatabase();

  return db.collection(name);
};

export {
  getCollection
};
