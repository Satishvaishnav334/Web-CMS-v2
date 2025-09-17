

import mongoose from 'mongoose';
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

let isConnected = false;
async function connectToDatabase() {
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(uri as string);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }

}



connectToDatabase().then(()=>console.log("DB Coonect successfully")).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});


export default connectToDatabase;