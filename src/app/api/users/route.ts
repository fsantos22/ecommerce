import prisma from '@/lib/db'
import { userSchema } from '@/schemas/user'
import { excludeFromList, excludeFromObject } from '@/utils/ExcludeResponseParam'
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

    return NextResponse.json(excludeFromList(users, ['password']), { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error in fetching users' + error }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const response = userSchema.parse(body)
    const { firstName, lastName, email, password } = response

    const findUser = await prisma.users.findUnique({ where: { email } })

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
        user: excludeFromObject(newUser, ['password']),
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const { id, email, password } = await req.json()

  const findUser = await prisma.users.findUnique({ where: { id } })

  if (!findUser) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const updatedUser = await prisma.users.update({
    where: { id },
    data: { email, password },
  })

  return NextResponse.json(
    {
      message: 'User updated successfully',
      user: excludeFromObject(updatedUser, ['password']),
    },
    { status: 201 },
  )
}

export async function DELETE(req: Request) {
  const { id } = await req.json()

  const findUser = await prisma.users.findUnique({ where: { id } })

  if (!findUser) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const deletedUser = await prisma.users.delete({
    where: { id },
  })

  return NextResponse.json(
    {
      message: 'User deleted successfully',
      user: excludeFromObject(deletedUser, ['password']),
    },
    { status: 201 },
  )
}
