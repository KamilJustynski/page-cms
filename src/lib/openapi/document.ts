import { createDocument } from "zod-openapi";
import {
  pageSchema,
  createPageSchema,
  problemSchema,
  pageParamsSchema,
  updatePageSchema,
} from "@/lib/validation/page";
import * as z from "zod";

export const openApiDocument = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Page CMS API",
    version: "1.0.0",
    description: "REST API for managing CMS pages.",
  },
  servers: [{ url: "http://localhost:4000" }],

  paths: {
    "/api/v1/pages": {
      get: {
        summary: "List all pages",
        responses: {
          "200": {
            description: "List of pages",
            content: {
              "application/json": {
                schema: z.array(pageSchema),
              },
            },
          },
        },
      },
      post: {
        summary: "Create a page",
        requestBody: {
          content: {
            "application/json": {
              schema: createPageSchema,
            },
          },
        },
        responses: {
          "201": {
            description: "Page created",
            headers: z.object({
              Location: z
                .string()
                .meta({ description: "URL of the created page" }),
            }),
            content: {
              "application/json": { schema: pageSchema },
            },
          },
          "400": {
            description: "Invalid JSON or validation failed",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
          "409": {
            description: "A page with this slug already exists",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
          "500": {
            description: "Unexpected server error",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
        },
      },
    },
    "/api/v1/pages/{id}": {
      get: {
        summary: "Get a page by id",
        requestParams: {
          path: pageParamsSchema,
        },
        responses: {
          "200": {
            description: "The page",
            content: {
              "application/json": { schema: pageSchema },
            },
          },
          "404": {
            description: "No page with this id",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
          "400": {
            description: "Invalid page id",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
        },
      },
      patch: {
        summary: "Update a page by id",
        requestBody: {
          content: {
            "application/json": {
              schema: updatePageSchema,
            },
          },
        },
        requestParams: {
          path: pageParamsSchema,
        },
        responses: {
          "200": {
            description: "Page updated",
            content: {
              "application/json": {
                schema: pageSchema,
              },
            },
          },
          "400": {
            description: "Invalid page id",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
          "404": {
            description: "No page with this id",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
          "409": {
            description: "Page with this data already exist",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
          "500": {
            description: "Unexpected server error",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
        },
      },
      delete: {
        summary: "Delete a page by id",
        requestParams: {
          path: pageParamsSchema,
        },
        responses: {
          "204": {
            description: "Page deleted",
          },
          "400": {
            description: "Invalid page id",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
          "404": {
            description: "No page with this id",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
          "500": {
            description: "Unexpected server error",
            content: {
              "application/problem+json": { schema: problemSchema },
            },
          },
        },
      },
    },
  },
});
