export class JKError extends Error {
  ErrorContent: string;
  status: number;
  message: string;
  constructor(text: string, status: number, ...arg: any) {
    super(text);
    this.ErrorContent = text;
    this.status = status;
    this.message = arg;
  }
}
