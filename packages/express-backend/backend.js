import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };

app.get("/", (req, res) => {
res.send("Hello World!");
});

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
  };

const findUserByJob = (job) => {
    return users["users_list"].filter(
        (user) => user["job"] === job
    );
}
  
app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    if (name != undefined && job != undefined) {
        let result = users["users_list"].filter(
            (user) => user["name"] === name && user["job"] === job);
        result = { users_list: result };
        res.send(result);
    } else if (name != undefined) {
        let result = findUserByName(name);
        result = { user_list: result };
        res.send(result);
    } else if (job != undefined) {
        let result = findUserByJob(job);
        result = { user_list: result };
        res.send(result);
    } else {
        res.send(users);
    }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const randomId = () => {
  return Math.random().toString(36).substr(2,6);
};

const addUser = (user) => {
  user.id = randomId(); // assigns the user a random id
  users["users_list"].push(user);
    return user;
};

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    const addedUser = addUser(userToAdd);
    res.status(201).send(addedUser);
});

const deleteUserById = (id) => {
    const initialLength = users["users_list"].length;
    users["users_list"] = users["users_list"].filter((user) => user["id"] !== id);

    return users["users_list"].length < initialLength;
  };

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    const userDeleted = deleteUserById(id);
    if (!userDeleted) {
        res.status(404).send("Resource not found."); // users_lists would decrease when deletion is sucessful
    } else {
        res.status(204).send("");
    }
})

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});