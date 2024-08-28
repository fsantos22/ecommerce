import prisma from '@/lib/db'
import { UserSchemaOutput } from '@/schemas/user'
import { hashPass } from '@/utils/HashManager'
import { generateToken } from '@/utils/Jwt'
import { sendMail } from '@root/service/mailService'
import { NextRequest, NextResponse } from 'next/server'

export type userDTO = {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error in fetching users - ' + error }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const response = UserSchemaOutput.parse(body)
    const { firstName, lastName, email, password } = response

    const findUser = await prisma.user.findUnique({ where: { email } })

    if (findUser) {
      return NextResponse.json({ message: 'E-mail already registered' }, { status: 409 })
    }

    const hashPassword = await hashPass(password)

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    })
    const emailVerificationToken = generateToken(newUser.id, email)
    const emailUrl = process.env.HOST + '/api/activate/' + emailVerificationToken.token
    const emailContent = `<span>Please, visit the link to activate your E-mail - <a href='${emailUrl}'>${emailUrl}</a><span>` //EDITAR E MONTAR O HTML COM O LINK
    await sendMail({ subject: '[ECOM] E-mail verification', to: email, html: emailContent })

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

export async function PATCH(req: NextRequest) {
  const { id, email, password } = await req.json()

  const findUser = await prisma.user.findUnique({ where: { id } })

  if (!findUser) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { email, password },
    select: { id: true, firstName: true, lastName: true, email: true },
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

  const findUser = await prisma.user.findUnique({ where: { id } })

  if (!findUser) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const deletedUser = await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  })

  return NextResponse.json(
    {
      message: 'User deleted successfully',
      user: deletedUser,
    },
    { status: 201 },
  )
}
