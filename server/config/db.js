const mongoose = require('mongoose');

function dbConnect() {
  // using mongoose for database connection
  mongoose.connect('mongodb://localhost/TipManager', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  mongoose.set('debug', function (collectionName, method, query, doc) {
    console.log(
      'collectionName, method, query, doc :>> ',
      collectionName,
      method,
      query,
      doc
    );
    console.log('JSON.stringify(query) :>> ', JSON.stringify(query));
    // Here query is what you are looking for.
    // so whatever you want to do with the query
    // would be done in here
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'error connection'));
  db.once('open', () => {
    console.log('DB CONNECTED');
  });
}

module.exports = dbConnect;
