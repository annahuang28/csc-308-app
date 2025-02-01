import express from "express";
import cors from "cors";
import userService from "./user-service.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  try {
    const result = await userService.getUsers(name, job);
    res.send({ users_list: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});


app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; 

  userService
    .findUserById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send("Resource not found.");
      }
      res.send(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal server error");
    });
});


app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService
    .addUser(userToAdd)
    .then((addedUser) => {
      res.status(201).send(addedUser);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to add user");
    });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];

  userService
    .deleteUserById(id)
    .then((success) => {
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).send("Resource not found");
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal server error");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
