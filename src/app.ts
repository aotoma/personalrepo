import express from 'express';
import { userRouter } from './users/users.controller';
const app = express();

app.use(express.json());

app.use('/users', userRouter);

const server = app.listen(3000, () =>
  console.log(` Server ready at: http://localhost:3000`)
);
