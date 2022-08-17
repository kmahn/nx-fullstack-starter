import { ErrorCode } from '../../types/error-code';

export interface ErrorResponseDto {
  code: ErrorCode;
  statusCode: number;
  message?: string;
  data?: unknown;
}
