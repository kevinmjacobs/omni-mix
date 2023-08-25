import express from 'express';
const hostname = '127.0.0.1';
const port = 3000;

const app = express();
app.set('view engine', 'ejs');

const todos = [{
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

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.render('index', {
    data: todos,
  });
});

app.post("/", (req, res) => {
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

app.post("/delete", (req, res) => {
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

app.listen(3000, (req, res) => {
  console.log("App is running on port 3000");
});