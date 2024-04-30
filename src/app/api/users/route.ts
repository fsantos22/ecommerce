import prisma from '@/lib/db'
import { userSchema } from '@/schemas/user'
import { hashPass } from '@/utils/HashManager'
import { NextRequest, NextResponse } from 'next/server'

export type userDTO = {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  created_at: Date
  updated_at: Date
}

export async function GET() {
  try {
    const users = await prisma.users.findMany()

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error in fetching users' + error }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const response = userSchema.parse(body)
    const { firstName, lastName, email, password } = response

    const findUser = await prisma.users.findFirst({ where: { email } })

    if (findUser) {
      return NextResponse.json({ message: 'E-mail already registered' }, { status: 409 })
    }

    const hashPassword = await hashPass(password)

    const newUser = await prisma.users.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashPassword,
      },
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: newUser,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const { id, email, password } = await req.json()

  const updatedUser = await prisma.users.update({
    where: { id },
    data: { email, password },
  })

  return NextResponse.json(
    {
      message: 'User updated successfully',
      user: updatedUser,
    },
    { status: 201 },
  )
}

export async function DELETE(req: Request) {
  const { id } = await req.json()

  const deletedUser = await prisma.users.delete({
    where: { id },
  })

  return NextResponse.json(
    {
      message: 'User deleted successfully',
      user: deletedUser,
    },
    { status: 201 },
  )
}
