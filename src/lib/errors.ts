export class SlugConflictError extends Error {
  constructor(public readonly slug: string) {
    super(
      `A page with the slug "${slug}" already exists. Please choose a different slug.`,
    );
    this.name = `SlugConflictError`;
    Object.setPrototypeOf(this, SlugConflictError.prototype);
  }
}

export class BlockTypeMismatchError extends Error {
  constructor(
    public readonly existingType: string,
    public readonly updatesType: string,
  ) {
    super(
      `Cannot change a block's type from "${existingType}" to "${updatesType}". ` +
        `Delete the block and create a new one instead.`,
    );
    this.name = "BlockTypeMismatchError";
    Object.setPrototypeOf(this, BlockTypeMismatchError.prototype);
  }
}

export class BlockOrderMismatchError extends Error {
  constructor(public readonly pageId: string) {
    super(
      `The submitted block order does not match the blocks on this page. ` +
        `Send every block of the page exactly once, in the desired order.`,
    );
    this.name = "BlockOrderMismatchError";
    Object.setPrototypeOf(this, BlockOrderMismatchError.prototype);
  }
}
