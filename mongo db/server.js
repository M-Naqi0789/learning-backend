import express from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "dotenv";

config({
  path: "./.env",
});

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  return res.status(200).send({
    statusCode: 200,
    message: "Welcome to Back End using Node JS",
  });
});

// basic set up done 
// node syntax - done 
// express routes - req (incoming data), res (outgoing data), next (moving to next route synchronously)
// http method - get, ost, put/patch, delete. (CRUD)
// middleware - functions between req and res data 

// eg route :
 
// app.post("/todo/add", (req, res) => {
//   const { todoValue } = req?.body;
//   console.log(`Body data: ${todoValue}`);

//   try {
//     // 400:
//     if (!todoValue) {
//       return res.status(400).send({
//         status: false,
//         message: "Todo value is required.",
//       });
//     }

//     // 200:
//     const fetchTodos = [...todoBucket];
//     fetchTodos.push(todoValue);
//     todoBucket = fetchTodos;

//     return res.status(200).send({
//       status: true,
//       message: "Todo added successfully",
//     });
//   } catch (error) {
//     // 500:
//     return res.status(500).send({
//       status: false,
//       message: "Server is not working!",
//     });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
