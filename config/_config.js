/** MongoDB Connection */ 
import mongoose from 'mongoose';

const url = 'mongodb+srv://dbadmin:Wyu4HG4g1Xw03XEL@cluster0.5ljdj.mongodb.net/portfolio?retryWrites=true&w=majority';
// const url = 'mongodb+srv://dbadmin:Wyu4HG4g1Xw03XEL@cluster0.5ljdj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const mongooseConn = mongoose.connect(url,  { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));

export default {
    mongooseConn
}