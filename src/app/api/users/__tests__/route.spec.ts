import { NextRequest } from 'next/server'
import httpMocks from 'node-mocks-http'
import { prismaMock } from '../../../../../singleton'
import * as handler from '../route'
import { excludeFromList, excludeFromObject } from '@/utils/ExcludeResponseParam'

type TMockUser = Omit<handler.userDTO, 'confirmPassword' | 'created_at' | 'updated_at'> & { created_at: string; updated_at: string }

const userResponseMock: TMockUser[] = [
  {
    id: 'abc001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@test.com',
    password: 'abc123',
    created_at: '2024-04-03T22:52:06.903Z',
    updated_at: '2024-04-03T22:52:06.903Z',
  },
  {
    id: 'abc002',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@test.com',
    password: 'cde456',
    created_at: '2024-04-25T00:01:10.583Z',
    updated_at: '2024-04-25T00:01:10.583Z',
  },
]

const userMock = {
  id: 'abc001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@test.com',
  password: 'abc123',
  created_at: '2024-04-03T22:52:06.903Z',
  updated_at: '2024-04-03T22:52:06.903Z',
}

describe('/api/users', () => {
  describe('GET method', () => {
    // TODO
    // config authentication features
    // admin can get users
    // if not, throw error (Unauthenticated)
    // if you have wrong role, throw error (Unauthorized)
    //if admin, return users list
    it('should return all users list', async () => {
      prismaMock.users.findMany.mockResolvedValue(userResponseMock as unknown as handler.userDTO[])

      const response = await handler.GET()
      const body = await response.json()

      expect(response.status).toBe(200)
      expect(body).toEqual(excludeFromList(userResponseMock, ['password']))
    })
  })

  describe('POST method', () => {
    describe('Happy path', () => {
      it('should create a new user successfully', async () => {
        prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

        const { req } = httpMocks.createMocks({
          method: 'POST',
          body: {},
        })
        req.json = jest.fn().mockResolvedValue({
          firstName: userMock.firstName,
          lastName: userMock.lastName,
          email: userMock.email,
          password: userMock.password,
          confirmPassword: userMock.password,
        })

        const response = await handler.POST(req as unknown as NextRequest)
        const body = await response.json()

        expect(response.status).toBe(201)
        expect(body.user).toEqual(excludeFromObject(userMock, ['password']))
        expect(body.message).toEqual('User created successfully')
      })
    })
    describe('Unhappy path', () => {
      it('should throw an error when e-mail is already registered', async () => {
        prismaMock.users.findUnique.mockResolvedValue(userMock as unknown as handler.userDTO)
        prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

        const { req } = httpMocks.createMocks({
          method: 'POST',
          body: {},
        })
        req.json = jest.fn().mockResolvedValue({
          firstName: userMock.firstName,
          lastName: userMock.lastName,
          email: userMock.email,
          password: userMock.password,
          confirmPassword: userMock.password,
        })

        const response = await handler.POST(req as unknown as NextRequest)
        const body = await response.json()

        expect(response.status).toBe(409)
        expect(body).toEqual({ message: 'E-mail already registered' })
      })

      describe('Missing input', () => {
        it('should throw an error when firstName input is missing', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            lastName: userMock.lastName,
            email: userMock.email,
            password: userMock.password,
            confirmPassword: userMock.password,
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('invalid_type')
          expect(errorObject.path[0]).toEqual('firstName')
          expect(errorObject.message).toEqual('Required')
        })

        it('should throw an error when lastName input is missing', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: userMock.firstName,
            email: userMock.email,
            password: userMock.password,
            confirmPassword: userMock.password,
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('invalid_type')
          expect(errorObject.path[0]).toEqual('lastName')
          expect(errorObject.message).toEqual('Required')
        })

        it('should throw an error when email input is missing', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: 'John',
            lastName: 'Doe',
            password: 'abc123',
            confirmPassword: 'abc123',
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('invalid_type')
          expect(errorObject.path[0]).toEqual('email')
          expect(errorObject.message).toEqual('Required')
        })

        it('should throw an error when password input is missing', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@test.com',
            confirmPassword: 'abc123',
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('invalid_type')
          expect(errorObject.path[0]).toEqual('password')
          expect(errorObject.message).toEqual('Required')
        })

        it('should throw an error when confirmPassword input is missing', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@test.com',
            password: 'abc123',
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('invalid_type')
          expect(errorObject.path[0]).toEqual('confirmPassword')
          expect(errorObject.message).toEqual('Required')
        })
      })

      describe('Invalid input', () => {
        it('should throw an error when firstName input is too small', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: 'a',
            lastName: userMock.lastName,
            email: userMock.email,
            password: userMock.password,
            confirmPassword: userMock.password,
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('too_small')
          expect(errorObject.path[0]).toEqual('firstName')
          expect(errorObject.message).toEqual('O nome deve ter pelo menos 2 caracteres')
        })

        it('should throw an error when firstName input is too big', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lastName: userMock.lastName,
            email: userMock.email,
            password: userMock.password,
            confirmPassword: userMock.password,
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('too_big')
          expect(errorObject.path[0]).toEqual('firstName')
          expect(errorObject.message).toEqual('O nome deve ter no máximo 30 caracteres')
        })

        it('should throw an error when lastName input is too small', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: userMock.firstName,
            lastName: 'D',
            email: userMock.email,
            password: userMock.password,
            confirmPassword: userMock.password,
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('too_small')
          expect(errorObject.path[0]).toEqual('lastName')
          expect(errorObject.message).toEqual('O sobrenome deve ter pelo menos 2 caracteres')
        })

        it('should throw an error when lastName input is too big', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: userMock.firstName,
            lastName: 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ',
            email: userMock.email,
            password: userMock.password,
            confirmPassword: userMock.password,
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('too_big')
          expect(errorObject.path[0]).toEqual('lastName')
          expect(errorObject.message).toEqual('O sobrenome deve ter no máximo 60 caracteres')
        })

        it('should throw an error when email is invalid', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: userMock.firstName,
            lastName: userMock.lastName,
            email: 'johndoe@example',
            password: userMock.password,
            confirmPassword: userMock.password,
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('invalid_string')
          expect(errorObject.path[0]).toEqual('email')
          expect(errorObject.message).toEqual('E-mail inválido')
        })

        it('should throw an error when password input is too small', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: userMock.firstName,
            lastName: userMock.lastName,
            email: userMock.email,
            password: 'abc1',
            confirmPassword: 'abc1',
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('too_small')
          expect(errorObject.path[0]).toEqual('password')
          expect(errorObject.message).toEqual('A senha deve ter pelo menos 5 caracteres')
        })

        it('should throw an error when password input is too big', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: userMock.firstName,
            lastName: userMock.lastName,
            email: userMock.email,
            password: 'abcdefghjkl1234567890',
            confirmPassword: 'abcdefghjkl1234567890',
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('too_big')
          expect(errorObject.path[0]).toEqual('password')
          expect(errorObject.message).toEqual('A senha deve ter no máximo 15 caracteres')
        })

        it('should throw an error when password and confirmPassword are not equal', async () => {
          prismaMock.users.create.mockResolvedValue(userMock as unknown as handler.userDTO)

          const { req } = httpMocks.createMocks({
            method: 'POST',
            body: {},
          })
          req.json = jest.fn().mockResolvedValue({
            firstName: userMock.firstName,
            lastName: userMock.lastName,
            email: userMock.email,
            password: userMock.password,
            confirmPassword: 'cba321',
          })

          const response = await handler.POST(req as unknown as NextRequest)
          const body = await response.json()
          const errorObject = body.error.issues[0]

          expect(response.status).toBe(500)
          expect(errorObject.code).toEqual('custom')
          expect(errorObject.path[0]).toEqual('confirmPassword')
          expect(errorObject.message).toEqual('As senhas não são iguais')
        })
      })
    })
  })

  describe('PATCH method', () => {
    describe('Happy path', () => {
      it('should update e-mail when you pass only id and email parameters', async () => {
        prismaMock.users.findUnique.mockResolvedValue(userMock as unknown as handler.userDTO)
        const updatedUserMock = { ...userMock, email: 'johndoe@test.com.br' }
        prismaMock.users.update.mockResolvedValue(excludeFromObject(updatedUserMock, ['password']) as unknown as handler.userDTO)

        const { req } = httpMocks.createMocks({
          method: 'PATCH',
          body: {},
        })
        req.json = jest.fn().mockResolvedValue({
          id: updatedUserMock.id,
          email: updatedUserMock.email,
        })

        const response = await handler.PATCH(req as unknown as NextRequest)
        const body = await response.json()

        expect(response.status).toBe(201)
        expect(body.message).toEqual('User updated successfully')
        expect(body.user).toEqual(excludeFromObject(updatedUserMock, ['password']))
      })

      it('should update password when you pass only id and password parameters', async () => {
        prismaMock.users.findUnique.mockResolvedValue(userMock as unknown as handler.userDTO)
        const updatedUserMock = { ...userMock, password: 'cde456' }
        prismaMock.users.update.mockResolvedValue(excludeFromObject(updatedUserMock, ['password']) as unknown as handler.userDTO)

        const { req } = httpMocks.createMocks({
          method: 'PATCH',
          body: {},
        })
        req.json = jest.fn().mockResolvedValue({
          id: updatedUserMock.id,
          password: updatedUserMock.password,
        })

        const response = await handler.PATCH(req as unknown as NextRequest)
        const body = await response.json()

        expect(response.status).toBe(201)
        expect(body.message).toEqual('User updated successfully')
        expect(body.user).toEqual(excludeFromObject(updatedUserMock, ['password']))
      })

      it('should update e-mail and password when you pass id, email and password parameters', async () => {
        prismaMock.users.findUnique.mockResolvedValue(userMock as unknown as handler.userDTO)
        const updatedUserMock = { ...userMock, email: 'johndoe@test.com.br' }
        prismaMock.users.update.mockResolvedValue(excludeFromObject(updatedUserMock, ['password']) as unknown as handler.userDTO)

        const { req } = httpMocks.createMocks({
          method: 'PATCH',
          body: {},
        })
        req.json = jest.fn().mockResolvedValue({
          id: updatedUserMock.id,
          email: updatedUserMock.email,
          password: updatedUserMock.password,
        })

        const response = await handler.PATCH(req as unknown as NextRequest)
        const body = await response.json()

        expect(response.status).toBe(201)
        expect(body.message).toEqual('User updated successfully')
        expect(body.user).toEqual(excludeFromObject(updatedUserMock, ['password']))
      })
    })

    describe('Unhappy path', () => {
      it('should throw an error when user is not found', async () => {
        prismaMock.users.findUnique.mockResolvedValue(null)
        prismaMock.users.update.mockResolvedValue(excludeFromObject(userMock, ['password']) as unknown as handler.userDTO)

        const { req } = httpMocks.createMocks({
          method: 'PATCH',
          body: {},
        })
        req.json = jest.fn().mockResolvedValue({
          id: 'abc987',
          email: userMock.email,
          password: userMock.password,
        })

        const response = await handler.PATCH(req as unknown as NextRequest)
        const body = await response.json()

        expect(response.status).toBe(404)
        expect(body).toEqual({ message: 'User not found' })
      })
    })
  })

  describe('DELETE method', () => {
    describe('Happy path', () => {
      it('should update e-mail when you pass only id and email parameters', async () => {
        prismaMock.users.findUnique.mockResolvedValue(userMock as unknown as handler.userDTO)
        prismaMock.users.delete.mockResolvedValue(excludeFromObject(userMock, ['password']) as unknown as handler.userDTO)

        const { req } = httpMocks.createMocks({
          method: 'DELETE',
          body: {},
        })
        req.json = jest.fn().mockResolvedValue({
          id: userMock.id,
        })

        const response = await handler.DELETE(req as unknown as NextRequest)
        const body = await response.json()

        expect(response.status).toBe(201)
        expect(body.message).toEqual('User deleted successfully')
        expect(body.user).toEqual(excludeFromObject(userMock, ['password']))
      })
    })

    describe('Unhappy path', () => {
      it('should throw an error when user is not found', async () => {
        prismaMock.users.findUnique.mockResolvedValue(null)
        prismaMock.users.delete.mockResolvedValue(excludeFromObject(userMock, ['password']) as unknown as handler.userDTO)

        const { req } = httpMocks.createMocks({
          method: 'DELETE',
          body: {},
        })
        req.json = jest.fn().mockResolvedValue({
          id: 'abc987',
        })

        const response = await handler.DELETE(req as unknown as NextRequest)
        const body = await response.json()

        expect(response.status).toBe(404)
        expect(body).toEqual({ message: 'User not found' })
      })
    })
  })
})
