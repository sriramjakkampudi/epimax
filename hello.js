const express = require("express");
const path = require("path");


const app = express();

const mysql = require("./sql-table")

const con = mysql.createConnection({
    host:'localhost3305',
    user:'root',
    password:'NextNext@123',
    database:'mysqlDB'
})

con.connect(function(err){
  if(err){
      console.log(err)

  }else{
      console.log("jsl");
  }
})



let db = null;

const initializeDBAndServer = () => {
  try {
    app.listen(3008, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log("jsl has a error");
    process.exit(1);
  }
};

initializeDBAndServer();

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.id = payload.id;
        next();
      }
    });
  }
};

//post

app.post("/tasks", async (request, response) => {
  console.log("jsl");
  const taskDetails = request.body;
  const {
    id,
    description,
    status,
    assignee_id,
    created_at,
    updated_at
  } = taskDetails;
  const addTaskQuery = `
    INSERT INTO
      book (id,description,status,assignee_id,created_at,updated_at)
    VALUES
      (
        ${id},
         '${description}',
         '${status}',
         ${assignee_id},
         '${created_at}',
        '${updated_at}'
      );`;

  const dbResponse = await db.run(addTaskQuery);
});


//get 
app.get("/tasks", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      user
    ORDER BY
      task_id;`;
  const tasks = await db.all(getBooksQuery);
  response.send(tasks);
  console.log(request);
});

//get with id 
app.get("/tasks/:id/", async (request, response) => {
  const { id } = request.params;
  const taskQuery = `
    SELECT
      *
    FROM
      Tasks
    WHERE
      id = ${id};`;
  const task = await db.get(getBookQuery);
  response.send(task);
});

//delete

app.delete("/tasks/:id/", async (request, response) => {
  const { id } = request.params;
  const deleteTaskQuery = `
    DELETE FROM
      tasks
    WHERE
      id = ${id};`;
  await db.run(deleteTaskQuery);
});

//login 

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      response.send("Login Success!");
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

