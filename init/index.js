const mongoose = require('mongoose');
main()
.then(res => console.log("DB is Connected."))
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const Listings = require('../models/listing');
const data = require('./data');

const initDB = async ()=>{
    await Listings.deleteMany({});
    data.data = data.data.map((object) => ({...object, owner : "6765a4ba0483bdb7d9ccee62"}));
    await Listings.insertMany(data.data);
    console.log("Data was initialized.");
}

initDB();