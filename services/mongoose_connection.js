require('dotenv').config()
const mongoose = require('mongoose')
main().catch(err => console.log(err));
async function main() {
    try {

        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "TrendCart"
        });
        console.log('Database Connected Successfully')
    }
    catch (err) {
        console.log(err)
    }

}

module.exports = { main, mongoose }