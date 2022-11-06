import express, { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

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

userRouter.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

userRouter.get('/users/:id', async (req: Request, res: Response)=>{
  const { id } = req.params
  const users = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  })
  if(users == null){
    res.status(404)
    res.send('User does not exist')
  }
  res.json(users)
});


userRouter.put('/users/:id', async (req, res) => {
  const { id } = req.params
  const { firstName, lastName, dob, email } = req.body;
  const dobIsoString = new Date(dob).toISOString();
  const user = await prisma.user.update({
    data:{
      firstName,
      lastName,
      dob: dobIsoString,
      email
    },
    where: {
      id: Number(id),
    },
  })
  res.json(user)
});

userRouter.delete(`/users/:id`, async (req, res) => {
  const { id } = req.params
  const result = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  })
  res.json(result)
});


userRouter.get('/users', async (req, res) => {
  const { searchString }: { searchString?: string } = req.query;
  const{dobS}: {dobS?: Date} = req.query;
  const filteredUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: searchString,
          },
        },
        {
          lastName: {
            contains: searchString,
          },
        },
        {
          email: {
            contains: searchString
          }
        },
        {
          dob:{
          equals: dobS
          }
        }
      ],
    },
  })
  
  res.json(filteredUsers)
})




export default { userRouter };
