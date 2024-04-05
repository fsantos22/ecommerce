import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { HashManager } from '@/utils/HashManager';

export async function GET() {
  try {
    const users = await prisma.users.findMany();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error in fetching users' + error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, res: Response) {
  const { firstName, lastName, email, password } = await req.json();

  try {
    const findUser = await prisma.users.findFirst({ where: { email: email } });

    if (findUser) {
      return NextResponse.json(
        { message: 'E-mail already registered' },
        { status: 409 }
      );
    }

    const hashManager = new HashManager();
    const hashPassword = await hashManager.hash(password);

    const newUser = await prisma.users.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashPassword,
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { id, email, password } = await req.json();

  const updatedUser = await prisma.users.update({
    where: { id: id },
    data: { email, password },
  });

  return NextResponse.json(
    {
      message: 'User updated successfully',
      user: updatedUser,
    },
    { status: 201 }
  );
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  const deletedUser = await prisma.users.delete({
    where: { id: id },
  });

  return NextResponse.json(
    {
      message: 'User deleted successfully',
      user: deletedUser,
    },
    { status: 201 }
  );
}
