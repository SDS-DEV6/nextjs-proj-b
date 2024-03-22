export class EmailNotVerifiedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailNotVerifiedError";
  }
}

export class UserNotVerifiedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotVerifiedError";
  }
}
