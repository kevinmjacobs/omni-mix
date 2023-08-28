import express from 'express';
const ROUTER = express.Router();

let todos = [
  {
    todoId: '1',
    todoTask: 'Walk the dog',
  },
  {
    todoId: '2',
    todoTask: 'Take out trash',
  },
  {
    todoId: '3',
    todoTask: 'Vacuum',
  }
];

ROUTER.get('/', (req, res, next) => {
  res.render('index', {
    data: todos,
  });
});

ROUTER.post("/", (req, res) => {
  const inputTodoId = todos.length + 1;
  const inputTodoTask = req.body.todoTask;

  todos.push({
    todoId: inputTodoId,
    todoTask: inputTodoTask
  });

  res.render("index", {
    data: todos,
  });
});

ROUTER.post("/delete", (req, res) => {
  var requestedtodoId = req.body.todoId;
  var j = 0;
  todos.forEach((todo) => {
    j = j + 1;
    if (todo.todoId === requestedtodoId) {
      todos.splice(j - 1, 1);
    }
  });
  res.redirect("/");
});

export default ROUTER;
