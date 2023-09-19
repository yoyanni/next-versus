import mongoose from "mongoose";

function init(DATABASE_URL: string) {
  mongoose.connect(DATABASE_URL);
  const db = mongoose.connection;
  db.on("error", (e) => console.log(e));
  db.once("open", () => console.log("Connected to MongoDB."));
}

export default init;
