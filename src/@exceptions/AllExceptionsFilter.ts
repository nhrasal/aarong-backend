import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { EntityColumnNotFound } from "typeorm/error/EntityColumnNotFound";
import { getNewLogger } from "../@logger/logger";
import { BaseLogger } from "../@logger/Base.logger";
import typeormQueryFailedMessageUtil from "../utils/typeormQueryFailedMessage.util";
import { RsException } from "./Rs.exception"; 

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: BaseLogger = getNewLogger("AllExceptionsFilter");

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    console.log("call from all Exception Handler >>>>>>>>>>>   ", exception);

    let statusCode: number;
    let errorMessages: string[] = [exception.message];
    if (exception instanceof RsException) {
    } else if (exception instanceof TypeError) {
      this.logger.error(exception.message, exception.stack, exception.name);
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      if (exception.message) {
        errorMessages = [exception.message];
      } else {
        errorMessages = ["internal server error"];
      }
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res: any = exception.getResponse();
      errorMessages =
        typeof res.message === "string" ? [res.message] : res.message;
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      errorMessages = typeormQueryFailedMessageUtil(exception);
    } else if (exception instanceof EntityColumnNotFound) {
      statusCode = HttpStatus.BAD_REQUEST;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessages = errorMessages.length
        ? errorMessages
        : ["internal server error"];
    }

    this.logger.error(exception.message, exception);

    const res = {
      success: false,
      statusCode: statusCode,
      message: "something went wrong",
      errorMessages,
      // timestamp: new Date().toISOString(),
      // path: request.url,
      devMessage: "something went wrong",
      // messages,
    };
    response.status(statusCode).json(res);
  }
}
