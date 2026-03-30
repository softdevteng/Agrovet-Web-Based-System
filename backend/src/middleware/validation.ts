import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { logger } from './logger.js'

interface ValidationSchema {
  [key: string]: Joi.Schema
}

export const validate = (schemas: ValidationSchema) => {
  return (req: any, res: Response, next: NextFunction) => {
    const errors: any = {}

    for (const [key, schema] of Object.entries(schemas)) {
      const data = req[key as keyof typeof req]
      if (!data) continue
      
      const { error, value } = schema.validate(data, {
        abortEarly: false,
      })

      if (error) {
        errors[key] = error.details.map((d) => d.message)
      } else {
        req[key as keyof typeof req] = value
      }
    }

    if (Object.keys(errors).length > 0) {
      logger.warn('Validation failed', errors)
      return res.status(400).json({ message: 'Validation failed', errors })
    }

    next()
  }
}

// Common validation schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  fullName: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'attendant', 'technician', 'vet').required(),
})

export const productSchema = Joi.object({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().integer().min(0).required(),
  reorderLevel: Joi.number().integer().min(0).required(),
  unit: Joi.string().required(),
  description: Joi.string().optional(),
})

export const transactionSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().positive().required(),
        unitPrice: Joi.number().positive().required(),
      })
    )
    .required(),
  subtotal: Joi.number().positive().required(),
  discount: Joi.number().min(0).required(),
  tax: Joi.number().min(0).required(),
  total: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('cash', 'card', 'mobile_money', 'cheque').required(),
  customerName: Joi.string().optional(),
  customerPhone: Joi.string().optional(),
  notes: Joi.string().optional(),
})

export const farmerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().optional(),
  location: Joi.string().required(),
  region: Joi.string().required(),
  numberOfCows: Joi.number().integer().min(0).optional(),
  creditLimit: Joi.number().min(0).optional(),
  notes: Joi.string().optional(),
})

export const cowSchema = Joi.object({
  farmerId: Joi.string().required(),
  name: Joi.string().required(),
  breed: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  idNumber: Joi.string().optional(),
  color: Joi.string().optional(),
})

export const aiServiceSchema = Joi.object({
  cowId: Joi.string().required(),
  farmerId: Joi.string().required(),
  semenStrawId: Joi.string().required(),
  heatDate: Joi.date().required(),
  serviceDate: Joi.date().required(),
  observationIndex: Joi.number().min(0).max(4).required(),
  cost: Joi.number().positive().optional(),
  notes: Joi.string().optional(),
})
