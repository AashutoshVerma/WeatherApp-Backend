var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");

var app = express();
// app.use(json());./

app.use(cors());
app.use(express.json());
app.listen(8080, () => {
  console.log("Server Started!!");
});

// mongourl = "mongodb://127.0.0.1:27017/WeatherApp";

mongourl =
  "mongodb+srv://itzaashustp:admin@cluster0.p5fxued.mongodb.net/WeatherApp";

mongoose
  .connect(mongourl, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const loginUserSchema = new mongoose.Schema(
  {
    time: String,
    username: String,
    password: String,
    location: String,
  },
  { collection: "loginUsers" }
);
const createUserSchema = new mongoose.Schema(
  {
    time: String,
    username: String,
    password: String,
    location: String,
  },
  { collection: "createUsers" }
);

app.get("/", (req, res) => {
  res.send("working");
});

var loginuser = mongoose.model("loginUsers", loginUserSchema);
var createuser = mongoose.model("createUsers", createUserSchema);
app.get("/getusers", async (req, res) => {
  console.log("working");
  try {
    const data = await createuser.find({});
    res.send(JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { time, username, location, password } = req.body;
    const findUser = await createuser.findOne({ username });
    if (findUser) {
      console.log(findUser);
      console.log(password + " : db : " + findUser.password);
      if (findUser) {
        if (password === findUser.password) {
          loginuser.create({ time, username, location });
          res.send({ status: "ok", data: findUser });
        } else {
          res.send({
            status: "not Ok",
          });
        }
      }
    } else {
      res.send({ status: "User Not Found  " });
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/createUser", async (req, res) => {
  try {
    {
      const { username, password, time, location } = req.body;
      const findUser = await createuser.findOne({ username });
      if (findUser) {
        res.send({ status: "User Exists" });
      } else {
        var newUser = createuser.create({ time, username, password, location });
        console.log(newUser);
        res.send({ status: "User Created" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});
