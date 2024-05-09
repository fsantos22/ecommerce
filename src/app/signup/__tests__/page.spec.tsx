/**
 * @jest-environment jsdom
 */

import SignUp from '@/app/signup/page'
import { RenderResult, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

type Elements = { [index: string]: any }
type ErrorInputs = { [index: string]: string }
type ErrorMessages = { [index: string]: ErrorInputs }
type ValidUser = { [index: string]: any }

const mapElements = (container: RenderResult) => {
  return {
    firstNameInput: container.getByLabelText('Nome'),
    lastNameInput: container.getByLabelText('Sobrenome'),
    emailInput: container.getByLabelText('E-mail'),
    passwordInput: container.getByLabelText('Senha'),
    confirmPasswordInput: container.getByLabelText('Confirmar senha'),
    submitButton: container.getByRole('button', {
      name: /Cadastrar conta/,
    }),
  }
}

const errorTexts: ErrorMessages = {
  firstNameInput: {
    minLength: 'O nome deve ter pelo menos 2 caracteres',
    maxLength: 'O nome deve ter no máximo 30 caracteres',
  },
  lastNameInput: {
    minLength: 'O sobrenome deve ter pelo menos 2 caracteres',
    maxLength: 'O sobrenome deve ter no máximo 60 caracteres',
  },
  emailInput: { invalidType: 'E-mail inválido' },
  passwordInput: {
    minLength: 'A senha deve ter pelo menos 5 caracteres',
    maxLength: 'A senha deve ter no máximo 15 caracteres',
  },
  confirmPasswordInput: {
    minLength: 'A senha deve ter pelo menos 5 caracteres',
    maxLength: 'A senha deve ter no máximo 15 caracteres',
    dontMatch: 'As senhas não são iguais',
  },
}

const validUser: ValidUser = {
  firstNameInput: 'John',
  lastNameInput: 'Doe',
  emailInput: 'johndoe@test.com',
  passwordInput: 'abc123',
  confirmPasswordInput: 'abc123',
  successMessage: 'Cadastro realizado com sucesso!',
}

describe('SignUp component', () => {
  it('renders correctly', () => {
    const container = render(<SignUp />)
    const elements: Elements = mapElements(container)
    Object.keys(elements).forEach((element) => {
      expect(elements[element]).toBeInTheDocument()
    })
  })

  describe('displays error messages on invalid form submission', () => {
    const cases = [
      ['firstNameInput', 'minLength', 'A'],
      ['firstNameInput', 'maxLength', 'AbcdeFghjk Zxcvb AbcdeFghjk Zxcvb'],
      ['lastNameInput', 'minLength', 'B'],
      ['lastNameInput', 'maxLength', 'AbcdeFghjk Zxcvb AbcdeFghjk Zxcvb AbcdeFghjk Zxcvb AbcdeFghjk Zxcvb'],
      ['emailInput', 'invalidType', 'invalid-email'],
      ['passwordInput', 'minLength', 'abc1'],
      ['passwordInput', 'maxLength', 'Abcde12345Fghjkl'],
      ['confirmPasswordInput', 'dontMatch', 'cde321'],
    ]
    it.each(cases)('Validate %p for %p error', async (inputName, errorType, inputValue) => {
      const container = render(<SignUp />)
      const elements: Elements = mapElements(container)

      userEvent.type(elements[inputName], inputValue)
      fireEvent.click(elements.submitButton)

      waitFor(() => {
        expect(screen.getByText(errorTexts[inputName][errorType])).toBeInTheDocument()
      })
    })
  })

  it('should show a success message after form is submitted', async () => {
    const container = render(<SignUp />)
    const elements: Elements = mapElements(container)

    Object.keys(elements).forEach((element) => {
      userEvent.type(elements[element], validUser[element])
    })

    expect(screen.queryByTestId('alert-toast')).not.toBeInTheDocument()

    userEvent.click(elements.submitButton)

    waitFor(() => {
      expect(screen.getByTestId('alert-toast')).toBeInTheDocument()
      expect(screen.getByText(validUser.succesMessage)).not.toBeInTheDocument()
    })
  })
})
