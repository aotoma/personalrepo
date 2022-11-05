import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const userRouter = express.Router();

userRouter.post('/users', async (req: Request, res: Response) => {
  const { firstName, lastName, dob, email } = req.body;
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
});

export default { userRouter };
