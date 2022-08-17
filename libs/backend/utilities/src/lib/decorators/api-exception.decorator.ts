import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { HttpException } from '@starter/backend/exception';
import { ErrorResponseDto } from '@starter/global-data';

interface HttpExceptionConstructor<T extends HttpException> {
  new (response?: Partial<ErrorResponseDto>): T;
}

export function ApiExceptions<T extends HttpException>(
  ...constructors: HttpExceptionConstructor<T>[]
) {
  const exceptions = constructors.map((ctr) => new ctr());
  const options = exceptions
    .map((exception) => {
      const example = {};
      example[exception.name] = exception.getResponse();
      return {
        status: exception.getStatus(),
        schema: {
          anyOf: [
            {
              example: exception.getResponse(),
              properties: {
                code: {
                  type: (exception.getResponse() as ErrorResponseDto).code,
                },
                status: {
                  type: exception.getStatus(),
                },
              },
            },
          ],
        },
      };
    })
    .reduce((acc, cur) => {
      const exOption = acc.find((op) => op.status === cur.status);

      if (exOption) {
        exOption.schema.anyOf = [...exOption.schema.anyOf, ...cur.schema.anyOf];
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);

  return applyDecorators(...options.map((option) => ApiResponse(option)));
}
