const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose.connect(url).then((result) => {
  console.log('connected to mongoDB');
})
  .catch((error) => {
    console.log('error connecting', error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: [function validateNumber(number) {
      return /^\d{2,3}-\d+$/.test(number) && number.length >= 8;
    }, 'Number must be at least 8 digits, with 2 parts seperated by hyphen'],
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
