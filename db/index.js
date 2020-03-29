const mongoose = require('mongoose');
const config = require('config');

const connectDB = async () => {
	try {
		await mongoose.connect(
			`mongodb+srv://${config.get('MONGO_USER')}:${config.get('MONGO_PASSWORD')}@cluster0-ociw1.mongodb.net/${config.get('MONGO_DB')}?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true,
			}
		);

		console.log('MongoDB Connected...');
	} catch (error) {
		console.error(error.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
