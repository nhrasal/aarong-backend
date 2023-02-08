import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { getNewLogger } from "../@logger/logger";
import { BaseLogger } from "../@logger/Base.logger";
import { SuccessResponse } from "../@responses/success.response";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger: BaseLogger = getNewLogger("ResponseInterceptor");

  constructor() {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((content: any) => {
        console.log('Log from Response intrerceptor >> ');
        
        if (content instanceof Error) {
          // return content.getResponseObject();
          throw content;
        } else if (typeof content === "undefined") { 
          throw new ServiceUnavailableException();
        } else if (content instanceof SuccessResponse) {
          return content;
        } else if (content && typeof content.isUpdated == 'boolean' && content.isUpdated === true ) {
          
          return content;
        } else if (typeof content === "object" || Array.isArray(content)) {
          return new SuccessResponse({
            payload: content,
            message: "successful response",
          });
        } else if (
          typeof content === "string" ||
          typeof content === "number" ||
          typeof content === "boolean"
        ) {
          return new SuccessResponse({
            message: "successful response",
            payload: { content },
          });
        } else {
          throw new HttpException("Unknown error", HttpStatus.BAD_REQUEST);
        }
      })
    );
  }
}
