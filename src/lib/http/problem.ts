export type ProblemCode = "SERVER_ERROR" | "INVALID_JSON" | "SLUG_CONFLICT";

export type Problem = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  code: ProblemCode;
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
