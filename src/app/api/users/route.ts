import prisma from '@/lib/db'
import { hashPass } from '@/utils/HashManager'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req?: NextRequest) {
  try {
    const { searchParams } = new URL(req!.url) || undefined
    const id = searchParams ? searchParams.get('id') : undefined

    if (id) {
      const user = await prisma.users.findUnique({ where: { id } })
      return NextResponse.json(user, { status: 200 })
    }

    const users = await prisma.users.findMany()

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error in fetching users' + error }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await JSON.parse(JSON.stringify(req))

  try {
    const findUser = await prisma.users.findFirst({ where: { email } })

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: 'Missing parameter in body request' }, { status: 400 })
    }

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
