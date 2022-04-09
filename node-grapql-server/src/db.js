const mongoose = require('mongoose');

module.exports = {
  connect: DB_HOST => {
    mongoose
      .connect(DB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch(error => {
        console.log('Error connecting to MongoDB:', error.message);
        process.exit(1);
      });
  },
  close: () => {
    mongoose.connection.close();
  }
};
