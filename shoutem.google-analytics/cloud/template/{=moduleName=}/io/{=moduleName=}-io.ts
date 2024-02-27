import { jsonapi } from '../../shared/io';
import { loadModel } from '../../shared/db';
import { {=modelName.pascalCase=} } from '../data/{=moduleName=}-model';
import { {=modelName.constantCase=}_TYPE } from './types';
{=#associations=}
import { {=ioType=} } from '../../{=relatedModuleName=}/io/types';
{=/associations=}

/**
 * @swagger
 * definitions:
 *   {=modelName.pascalCase=}Reference:
 *     type: object
 *     required:
 *     - type
 *     - id
 *     properties:
 *       type:
 *         type: string
 *         enum: [ {=modelName.paramCasePlural=} ]
 *       id:
 *         type: string
 *   {=modelName.pascalCase=}:
 *     allOf:
 *       - $ref: '#/definitions/{=modelName.pascalCase=}Reference'
 *       - type: object
 *         properties:
 *           attributes:
 *             type: object
 *             properties:
                 {=#properties=}
 *               {=name=}:
 *                 type: {=swaggerType=}
                 {=/properties=}
 *   {=modelName.pascalCase=}JsonApiDocument:
 *     type: object
 *     required:
 *     - data
 *     properties:
 *       data:
 *         $ref: '#/definitions/{=modelName.pascalCase=}'
 *   {=modelName.pascalCase=}CollectionJsonApiDocument:
 *     type: object
 *     required:
 *     - data
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           $ref: '#/definitions/{=modelName.pascalCase=}'
 *   {=modelName.pascalCase=}SingleRelationship:
 *     type: object
 *     required:
 *     - data
 *     properties:
 *       data:
 *         $ref: '#/definitions/{=modelName.pascalCase=}Reference'
 *   {=modelName.pascalCase=}CollectionRelationship:
 *     type: object
 *     required:
 *     - data
 *     properties:
 *       data:
 *         type: array
 *         items:
 *           $ref: '#/definitions/{=modelName.pascalCase=}Reference'
 */
jsonapi.registerType({=modelName.constantCase=}_TYPE, {
  load: loadModel({=modelName.pascalCase=}),
  relationships: {
    {=#associations=}
    {=name=}: {
      type: {=ioType=},
      alternativeKey: '{=alternativeKey=}',
    },
    {=/associations=}
  },
});
