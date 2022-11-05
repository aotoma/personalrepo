import express from 'express';
import { userRouter } from './users/users.controller';
const app = express();

app.use(express.json());

app.use('/', userRouter);
app.post(`/users`, async (req, res, next) => {});

const server = app.listen(3000, () =>
  console.log(` Server ready at: http://localhost:3000`)
);
