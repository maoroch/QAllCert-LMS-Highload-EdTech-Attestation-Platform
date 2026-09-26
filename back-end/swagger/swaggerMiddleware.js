import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

// Mount with: app.use('/api-docs', ...swaggerMiddleware);
export const swaggerMiddleware = [
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        customSiteTitle: 'Qallcert API Docs',
        customCss: `
            .topbar { background-color: #4f46e5; }
            .topbar .download-url-wrapper { display: none; }
            .info .title { color: #4f46e5; }
        `,
        swaggerOptions: {
            persistAuthorization: true,   // keep token between page refreshes
            displayRequestDuration: true,
            filter: true,
            defaultModelsExpandDepth: 1,
        },
    }),
];

// Also expose raw JSON spec for tooling (Postman import etc.)
export const swaggerJsonMiddleware = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
};