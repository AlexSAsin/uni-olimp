declare global {
  interface ErrorResponse {
    readonly message: string;
    readonly status: number;
  }
}

export {};
