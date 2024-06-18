import * as bcrypt from 'bcryptjs'

export const hashPass = async (text: string): Promise<string> => {
  const rounds = 12
  const salt = await bcrypt.genSalt(rounds)
  const result = await bcrypt.hash(text, salt)
  return result
}

export const comparePass = async (text: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(text, hash)
}
