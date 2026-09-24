import * as z from "zod";
import { ProblemSchema } from "../validation/page";

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
