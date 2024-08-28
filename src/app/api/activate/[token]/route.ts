import { verifyToken } from '@/utils/Jwt'
import prisma from '@/lib/db'
import { NextResponse } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'
import { notFound } from 'next/navigation'
export async function GET(req: Request, { params }: { params: any }) {
  try {
    const { token } = params

    const decodedToken = verifyToken(token as string, String(process.env.EMAIL_VERIFICATION_SECRET)) as JwtPayload
    const findUser = await prisma.user.findUnique({ where: { id: decodedToken.data.id } })

    if (!decodedToken.data || !findUser) {
      return notFound()
    }

    if (findUser?.active) {
      return NextResponse.json({ message: 'E-mail already verified' }, { status: 409 })
    }

    await prisma.user.update({
      where: { id: findUser?.id },
      data: { active: true },
    })

    return NextResponse.redirect(new URL('/login', req.url))
  } catch (error) {
    return NextResponse.json({ message: 'Internal error - ' + error }, { status: 500 })
  }
}
