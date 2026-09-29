import Joi from 'joi';

// MongoDB ObjectId regex validation (24 hex characters)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

/**
 * Joi schema for validating resource creation request body (POST /api/resources)
 * Form 1 required fields: resourceName, resourceType, subscription, resourceGroup, region
 * Later-form fields (hardwareProfile, storage, network, highAvailability, tags) are optional at POST
 * but validated if supplied, supporting both initial Form 1 creation and complete creation.
 */
export const createResourceSchema = Joi.object({
  resourceName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'resourceName is required',
      'any.required': 'resourceName is required'
    }),
  resourceType: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .required()
    .messages({
      'string.empty': 'resourceType is required',
      'string.pattern.base': 'resourceType must be a valid MongoDB ObjectId',
      'any.required': 'resourceType is required'
    }),
  subscription: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .required()
    .messages({
      'string.empty': 'subscription is required',
      'string.pattern.base': 'subscription must be a valid MongoDB ObjectId',
      'any.required': 'subscription is required'
    }),
  resourceGroup: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .required()
    .messages({
      'string.empty': 'resourceGroup is required',
      'string.pattern.base': 'resourceGroup must be a valid MongoDB ObjectId',
      'any.required': 'resourceGroup is required'
    }),
  region: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .required()
    .messages({
      'string.empty': 'region is required',
      'string.pattern.base': 'region must be a valid MongoDB ObjectId',
      'any.required': 'region is required'
    }),
  description: Joi.string()
    .trim()
    .allow('', null)
    .max(500)
    .optional()
    .messages({
      'string.base': 'description must be a string'
    }),
  hardwareProfile: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .optional()
    .messages({
      'string.empty': 'hardwareProfile must be a valid MongoDB ObjectId',
      'string.pattern.base': 'hardwareProfile must be a valid MongoDB ObjectId'
    }),
  storage: Joi.object({
    type: Joi.string().trim().default('standard-ssd'),
    sizeGb: Joi.number().positive().required().messages({
      'number.base': 'storage.sizeGb must be a valid positive number',
      'number.positive': 'storage.sizeGb must be a valid positive number',
      'any.required': 'storage.sizeGb is required'
    })
  })
    .optional()
    .messages({
      'object.base': 'storage must be an object'
    }),
  network: Joi.object({
    publicIpEnabled: Joi.boolean().default(false).messages({
      'boolean.base': 'network.publicIpEnabled must be a boolean'
    })
  }).optional(),
  highAvailability: Joi.object({
    zoneRedundancy: Joi.boolean().default(false).messages({
      'boolean.base': 'highAvailability.zoneRedundancy must be a boolean'
    })
  }).optional(),
  tags: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().trim().required().messages({
          'string.empty': 'Tag key cannot be empty',
          'any.required': 'Tag key is required'
        }),
        value: Joi.string().trim().required().messages({
          'string.empty': 'Tag value cannot be empty',
          'any.required': 'Tag value is required'
        })
      }).messages({
        'object.base': 'Each tag must be an object with key and value'
      })
    )
    .optional()
    .messages({
      'array.base': 'tags must be an array of key-value objects'
    }),
  // Client-supplied createdBy is permitted in schema so it can be securely overridden/ignored
  createdBy: Joi.any().optional()
})
  .unknown(false)
  .messages({
    'object.unknown': 'Field {#label} is not allowed'
  });

/**
 * Joi schema for validating progressive resource updates (PATCH /api/resources/:id)
 * Used by Forms 2 and 3 to update configuration fields.
 * Protected/system fields (_id, ownerId, createdBy, createdAt, updatedAt, status) are disallowed.
 */
export const updateResourceSchema = Joi.object({
  resourceName: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.empty': 'resourceName cannot be empty'
    }),
  resourceType: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .optional()
    .messages({
      'string.empty': 'resourceType cannot be empty',
      'string.pattern.base': 'resourceType must be a valid MongoDB ObjectId'
    }),
  subscription: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .optional()
    .messages({
      'string.empty': 'subscription cannot be empty',
      'string.pattern.base': 'subscription must be a valid MongoDB ObjectId'
    }),
  resourceGroup: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .optional()
    .messages({
      'string.empty': 'resourceGroup cannot be empty',
      'string.pattern.base': 'resourceGroup must be a valid MongoDB ObjectId'
    }),
  region: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .optional()
    .messages({
      'string.empty': 'region cannot be empty',
      'string.pattern.base': 'region must be a valid MongoDB ObjectId'
    }),
  description: Joi.string()
    .trim()
    .allow('', null)
    .max(500)
    .optional()
    .messages({
      'string.base': 'description must be a string'
    }),
  hardwareProfile: Joi.string()
    .trim()
    .regex(objectIdRegex)
    .optional()
    .messages({
      'string.empty': 'hardwareProfile cannot be empty',
      'string.pattern.base': 'hardwareProfile must be a valid MongoDB ObjectId'
    }),
  storage: Joi.object({
    type: Joi.string().trim().optional(),
    sizeGb: Joi.number().positive().optional().messages({
      'number.base': 'storage.sizeGb must be a valid positive number',
      'number.positive': 'storage.sizeGb must be a valid positive number'
    })
  })
    .optional()
    .messages({
      'object.base': 'storage must be an object'
    }),
  network: Joi.object({
    publicIpEnabled: Joi.boolean().optional().messages({
      'boolean.base': 'network.publicIpEnabled must be a boolean'
    })
  })
    .optional()
    .messages({
      'object.base': 'network must be an object'
    }),
  highAvailability: Joi.object({
    zoneRedundancy: Joi.boolean().optional().messages({
      'boolean.base': 'highAvailability.zoneRedundancy must be a boolean'
    })
  })
    .optional()
    .messages({
      'object.base': 'highAvailability must be an object'
    }),
  tags: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().trim().required().messages({
          'string.empty': 'Tag key cannot be empty',
          'any.required': 'Tag key is required'
        }),
        value: Joi.string().trim().required().messages({
          'string.empty': 'Tag value cannot be empty',
          'any.required': 'Tag value is required'
        })
      }).messages({
        'object.base': 'Each tag must be an object with key and value'
      })
    )
    .optional()
    .messages({
      'array.base': 'tags must be an array of key-value objects'
    })
})
  .min(1)
  .unknown(false)
  .messages({
    'object.min': 'At least one field must be provided for update',
    'object.unknown': 'Field {#label} is not allowed'
  });
