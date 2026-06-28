import { sendError } from "../utils/apiResponse.js";

/**
 * Zod validation middleware factory.
 *
 * Usage:
 *   import { validate } from '../middlewares/validate.js';
 *   import { createPostSchema } from '../schemas/post.schema.js';
 *
 *   router.post('/posts', requireAuth, validate(createPostSchema), createPost);
 *
 * @param {import('zod').ZodSchema} schema - The Zod schema to validate against
 * @param {'body'|'query'|'params'} source - Which part of req to validate (default: 'body')
 */
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return sendError(res, "Validation failed", 400, errors);
    }

    // Replace the source with the parsed (and coerced) data
    req[source] = result.data;
    next();
  };
};
