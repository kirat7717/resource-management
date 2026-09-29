import 'dotenv/config';
import { Router } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Normalize URLs by trimming trailing slashes to avoid double slashes in API calls
const localUrl = 'http://localhost:5000';
const ngrokUrl = (process.env.NGROK_URL || 'https://resource-management-wtm5.onrender.com').replace(/\/+$/, '');

// Swagger/OpenAPI specification configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Resource Management Backend API',
      version: '1.0.0',
      description: 'REST API for the Resource Management Dashboard backend.'
    },
    servers: [
      {
        url: localUrl,
        description: 'Local Development'
      },
      {
        url: 'https://resource-management-wtm5.onrender.com',
        description: 'Production Server'
      },
      {
        url: ngrokUrl,
        description: 'Ngrok'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    './src/docs/paths/*.js',
    './src/docs/schemas/*.js'
  ]
};

// Generate OpenAPI specification
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Create dedicated router for Swagger UI
const swaggerRouter = Router();

// Serve and setup Swagger UI on the router
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { swaggerSpec };
export default swaggerRouter;
