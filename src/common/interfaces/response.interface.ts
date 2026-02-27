export class SendResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}
