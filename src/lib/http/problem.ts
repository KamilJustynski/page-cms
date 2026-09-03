import * as z from "zod";

export type ProblemCode =
  | "SERVER_ERROR"
  | "INVALID_JSON"
  | "SLUG_CONFLICT"
  | "NOT_FOUND"
  | "INVALID_DATA";

export type InvalidField = {
  name: string;
  reason: string;
};

export type Problem = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  code: ProblemCode;
  invalidFields?: InvalidField[];
};

export type ProblemInput = Omit<Problem, "type">;

export function problemResponse(input: ProblemInput): Response {
  const problem: Problem = {
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
