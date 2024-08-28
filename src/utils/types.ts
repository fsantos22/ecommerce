export interface EmailValidation {
  id: string
  email: string
}

export interface EncodeResult {
  token: string
}

export type DecodeResult =
  | {
      type: 'valid'
      data: EmailValidation
    }
  | {
      type: 'integrity-error'
    }
  | {
      type: 'invalid-token'
    }
