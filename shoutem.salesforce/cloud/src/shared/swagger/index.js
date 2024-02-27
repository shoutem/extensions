import swaggerJSDoc from 'swagger-jsdoc';
import config from './config';

const swaggerSpec = swaggerJSDoc(config.options);
export default swaggerSpec;