/**
 * @swagger
 * parameters:
 *   query:
 *     name: query
 *     in: query
 *     description: query for text search
 *     type: string
 *   pagingOffset:
 *     name: page[offset]
 *     in: query
 *     description: paging offset
 *     type: integer
 *   pagingLimit:
 *     name: page[limit]
 *     in: query
 *     description: paging limit
 *     type: integer
 * components:
 *   schemas:
 *     JsonApiPagingLinks:
 *       type: object
 *       properties:
 *         prev:
 *           type: string
 *         next:
 *           type: string
 */
