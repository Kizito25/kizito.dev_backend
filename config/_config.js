/** MongoDB Connection */
import mongoose from "mongoose";

const url = process.env.MONGO_URL;
mongoose.set("strictQuery", true);
const mongooseConn = mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

export default {
  mongooseConn,
};
