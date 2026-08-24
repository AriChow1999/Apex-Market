const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Replace with your MongoDB connection string or use process.env.MONGO_URI
        const conn = await mongoose.connect('mongodb://arijitchowdhury700_db_user:Arijit%401999@ac-q3sjvbs-shard-00-00.4feuw7r.mongodb.net:27017,ac-q3sjvbs-shard-00-01.4feuw7r.mongodb.net:27017,ac-q3sjvbs-shard-00-02.4feuw7r.mongodb.net:27017/?ssl=true&replicaSet=atlas-lnctl6-shard-0&authSource=admin&appName=Cluster0');

        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;