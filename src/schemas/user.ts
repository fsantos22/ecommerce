 import { z } from 'zod'
 
 export const userSchema = z
    .object({
      firstName: z
        .string()
        .min(2, { message: 'O nome deve ter pelo menos 2 caracteres' })
        .max(30, { message: 'O nome deve ter no máximo 30 caracteres' }),
      lastName: z
        .string()
        .min(2, { message: 'O sobrenome deve ter pelo menos 2 caracteres' })
        .max(60, { message: 'O sobrenome deve ter no máximo 60 caracteres' }),
      email: z.string().email({ message: 'E-mail inválido' }),
      password: z
        .string()
        .min(5, { message: 'A senha deve ter pelo menos 5 caracteres' })
        .max(15, { message: 'A senha deve ter no máximo 15 caracteres' }),
      confirmPassword: z
        .string()
        .min(5, { message: 'A senha deve ter pelo menos 5 caracteres' })
        .max(15, { message: 'A senha deve ter no máximo 15 caracteres' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas não são iguais',
      path: ['confirmPassword'],
    })