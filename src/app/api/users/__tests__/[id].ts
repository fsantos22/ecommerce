import prisma from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { NextApiRequest } from 'next'

export async function GET(req: NextApiRequest) {
  const {
    query: { id },
  } = req
  return NextResponse.json({ id, message: 'Author data fetched successfully' })
  // const router = useRouter()
  // try {
  //   const findUser = await prisma.users.findUnique({ where: { id: id as string } })
  //   if (findUser) {
  //     return NextResponse.json(findUser, { status: 200 })
  //   }
  //   return NextResponse.json({ message: 'User not found' }, { status: 401 })
  // } catch (error) {
  //   return NextResponse.json({ message: 'Error in fetching users' + error }, { status: 500 })
}

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await req.json()

  try {
    const findUser = await prisma.users.findFirst({ where: { email } })

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: 'Missing parameter in body request' }, { status: 400 })
    }

    if (findUser) {
      return NextResponse.json({ message: 'E-mail already registered' }, { status: 409 })
    }

    const newUser = await prisma.users.create({
      data: {
        firstName,
        lastName,
        email,
        password,
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
