import { JwtPayload, sign, verify, VerifyErrors } from 'jsonwebtoken'

export function generateToken(id: string, email: string) {
  const token = sign(
    {
      data: { id, email },
    },
    String(process.env.EMAIL_VERIFICATION_SECRET),
    { expiresIn: '24h' },
  )
  return { token }
}

export function verifyToken(token: string, secret: string) {
  const tokenData = verify(token, secret, function (err, decoded) {
    if (err) {
      return err
    } else {
      return decoded
    }
  }) as unknown as JwtPayload | VerifyErrors
  return tokenData
}
