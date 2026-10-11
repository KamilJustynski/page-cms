import * as z from "zod";
import type { ProblemSchema } from "../validation/page";
import { SlugConflictError } from "@/lib/errors";

export type ProblemInput = Omit<ProblemSchema, "type">;

export function problemResponse(input: ProblemInput): Response {
  const problem: ProblemSchema = {
    ...input,
    type: "about:blank",
  };
  return Response.json(problem, {
    status: problem.status,
    headers: {
      "Content-Type": "application/problem+json",
    },
  });
}

export function validationProblem(err: z.ZodError): Response {
  const problem: ProblemInput = {
    title: "Bad Request",
    status: 400,
    detail: err.issues.map((e) => e.message).join(", "),
    code: "INVALID_DATA",
    invalidFields: err.issues.map((e) => ({
      name: e.path.length === 0 ? "root" : e.path.join("."),
      reason: e.message,
    })),
  };
  return problemResponse(problem);
}

export function notFoundProblem(resource: string, id: string): Response {
  const problem: ProblemInput = {
    title: "Not Found",
    status: 404,
    detail: `${resource} with id "${id}" not found.`,
    code: "NOT_FOUND",
  };

  return problemResponse(problem);
}

export function errorProblem(error: unknown, detail: string): Response {
  if (error instanceof SlugConflictError) {
    return problemResponse({
      title: "Conflict",
      status: 409,
      detail: error.message,
      code: "SLUG_CONFLICT",
    });
  }

  if (error instanceof SyntaxError) {
    return problemResponse({
      title: "Bad Request",
      status: 400,
      detail: "The request body contains invalid JSON.",
      code: "INVALID_JSON",
    });
  }

  console.error(error);
  return problemResponse({
    title: "Internal Server Error",
    status: 500,
    detail,
    code: "SERVER_ERROR",
  });
}
