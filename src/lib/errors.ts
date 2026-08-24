export class SlugConflictError extends Error {
  constructor(public readonly slug: string) {
    super(
      `A page with the slug "${slug}" already exists. Please choose a different slug.`,
    );
    this.name = `SlugConflictError`;
    Object.setPrototypeOf(this, SlugConflictError.prototype);
  }
}
