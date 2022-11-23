import express, { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { object, string, is, size, refine,optional } from 'superstruct';
import isEmail from 'isemail';

const prisma = new PrismaClient();
export const userRouter = express.Router();

const User = object({
  firstName: size(string(), 2, 50),
  lastName: size(string(), 2, 50),
  email: optional (refine(string(), 'email', (v) => isEmail.validate(v))),
  dob: string()
});

userRouter.post('/', async (req: Request, res: Response) => {
  const { firstName, lastName, dob, email } = req.body;

  if (firstName == null || lastName == null || email == null || dob == null) {
    res.sendStatus(400);
  } else if (is(req.body, User)) {
    const dobIsoString = new Date(dob).toISOString();

    const result = await prisma.user.create({
      data: {
        firstName,
        lastName,
        dob: dobIsoString,
        email
      }
    });

    res.json(result);
  } else {
    res.sendStatus(400);
  }
});

userRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const users = await prisma.user.findUnique({
    where: {
      id: Number(id)
    }
  });
  if (users == null) {
    res.status(404);
    res.send('User does not exist');
  }
  res.json(users);
});

userRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dob } = req.body;
  if (firstName == null || lastName == null || dob == null) {
    res.sendStatus(400);
  } else if (is(req.body, User)) {
    const dobIsoString = new Date(dob).toISOString();
    const user = await prisma.user.update({
      data: {
        firstName,
        lastName,
        dob: dobIsoString
      },
      where: {
        id: Number(id)
      }
    });
    res.json(user);
  } else {
    res.sendStatus(400);
  }
});

userRouter.delete(`/:id`, async (req, res) => {
  const { id } = req.params;
  const result = await prisma.user.delete({
    where: {
      id: Number(id)
    }
  });
  res.json(result);
});

userRouter.get('/', async (req, res) => {
  const { fname, lname, email, dob } = req.query;
  if (fname == null && lname == null && email == null && dob == null) {
    const users = await prisma.user.findMany();
    res.json(users);
  } else {
    const filteredUsers = await prisma.user.findMany({
      where: {
        firstName: fname as string,

        lastName: lname as string,

        dob: new Date(dob as string).toISOString()
      }
    });
    res.json(filteredUsers);
  }
});

export default { userRouter };
