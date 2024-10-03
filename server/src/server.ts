import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./dbConnection/db.js";
dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "database and server started successfully at port",
        process.env.PORT
      );
    });
  })
  .catch((err: any) => {
    console.log(err.message);
    process.exit(0);
  });
