import Joi from "joi";
import { objectIdValidation } from "../../utils/custome-validation.js";

export const addToCartSchema = Joi.object({
  body: Joi.object({
    productId: Joi.custom(objectIdValidation).required().messages({
      "any.required": "Product ID is required",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
      "number.min": "Quantity must be at least 1",
      "any.required": "Quantity is required",
    }),
  }),
  params: Joi.object({
    userId: Joi.custom(objectIdValidation).required().messages({
      "any.required": "User ID is required",
    }),
  }),
});

export const getCartSchema = Joi.object({
  params: Joi.object({
    userId: Joi.custom(objectIdValidation).required().messages({
      "any.required": "User ID is required",
    }),
  }),
});

export const removeFromCartSchema = Joi.object({
  params: Joi.object({
    userId: Joi.custom(objectIdValidation).required().messages({
      "any.required": "User ID is required",
    }),
  }),
  body: Joi.object({
    productId: Joi.custom(objectIdValidation).required().messages({
      "any.required": "Product ID is required",
    }),
  }),
});
