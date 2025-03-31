// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    console.log("connected successfully!")
  await mongoose.connect('mongodb+srv://jaiminiv78:AfP15PCnoC1B5913@cluster0.7qv67u1.mongodb.net/CoupanDistribution');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
module.exports=main