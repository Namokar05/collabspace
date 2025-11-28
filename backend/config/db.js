import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);

        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose connected to MongoDB Atlas');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️  Mongoose disconnected from MongoDB Atlas');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔌 Mongoose connection closed due to app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('💡 Make sure your MongoDB Atlas credentials are correct in .env file');
        console.error('💡 Check if your IP address is whitelisted in MongoDB Atlas');
        process.exit(1);
    }
};

export default connectDB;