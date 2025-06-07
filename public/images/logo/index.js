const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");

dbConnect();

app.use(
  cors({
    origin: "https://xcdcrj-3000.csb.app",
    // origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "hello_world",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // vì đang test ở http (CodeSandbox)
      httpOnly: true,
      sameSite: "lax", // hoặc có thể bỏ luôn dòng này
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
