import { BadGatewayException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { isValidObjectId } from "mongoose";
import { Observable } from "rxjs";

@Injectable()
export class HasValidUserId implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const userId = request.headers["user-id"];
        if(!userId) {
            throw new BadGatewayException("user id is not provided")
        }
        if(!isValidObjectId(userId)) {
            throw new BadGatewayException("User is not valid")
        }
        request.userId = userId;

        return true;
    }
}