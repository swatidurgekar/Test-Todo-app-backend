const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const Todos = require("./models/todos");
const sequelize = require("./util/database");

const app = express();
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/post-todo", (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  Todos.create({
    name: name,
    description: description,
    status: "incomplete",
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/post-complete-todo/:id", (req, res, next) => {
  const id = req.params.id;
  Todos.findByPk(id)
    .then((todo) => {
      todo.name = todo.name;
      todo.description = todo.description;
      todo.status = "completed";
      todo.save();
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/delete-todo/:id", (req, res, next) => {
  const id = req.params.id;
  Todos.findByPk(id)
    .then((todo) => {
      todo.destroy();
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/", (req, res, next) => {
  Todos.findAll()
    .then((todos) => {
      res.render("todo.ejs", {
        todos: todos,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
