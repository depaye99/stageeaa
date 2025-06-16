export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export class Validator {
  static email(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const errors: string[] = []

    if (!email) {
      errors.push('L\'email est requis')
    } else if (!emailRegex.test(email)) {
      errors.push('Format d\'email invalide')
    }

    return { isValid: errors.length === 0, errors }
  }

  static required(value: any, fieldName: string): ValidationResult {
    const errors: string[] = []

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${fieldName} est requis`)
    }

    return { isValid: errors.length === 0, errors }
  }

  static phone(phone: string): ValidationResult {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
    const errors: string[] = []

    if (!phone) {
      errors.push('Le numéro de téléphone est requis')
    } else if (!phoneRegex.test(phone)) {
      errors.push('Format de téléphone invalide')
    }

    return { isValid: errors.length === 0, errors }
  }

  static validateForm(data: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): ValidationResult {
    const allErrors: string[] = []

    Object.entries(rules).forEach(([field, validator]) => {
      const result = validator(data[field])
      if (!result.isValid) {
        allErrors.push(...result.errors)
      }
    })

    return { isValid: allErrors.length === 0, errors: allErrors }
  }
}

// Middleware de validation pour les API routes
export function validateRequestBody(schema: Record<string, (value: any) => ValidationResult>) {
  return (handler: (request: Request, ...args: any[]) => Promise<Response>) => {
    return async (request: Request, ...args: any[]): Promise<Response> => {
      try {
        const body = await request.json()
        const validation = Validator.validateForm(body, schema)

        if (!validation.isValid) {
          return Response.json(
            { error: 'Données invalides', details: validation.errors },
            { status: 400 }
          )
        }

        return handler(request, ...args)
      } catch (error) {
        return Response.json(
          { error: 'Corps de requête invalide' },
          { status: 400 }
        )
      }
    }
  }
}

export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: false, message: 'L\'email est requis' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email)

  return {
    isValid,
    message: isValid ? undefined : 'Format d\'email invalide'
  }
}

export const validatePhone = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone) {
    return { isValid: false, message: 'Le numéro de téléphone est requis' }
  }

  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  const isValid = phoneRegex.test(phone)

  return {
    isValid,
    message: isValid ? undefined : 'Format de téléphone invalide (format français attendu)'
  }
}