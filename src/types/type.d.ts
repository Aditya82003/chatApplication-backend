import { JwtPayload } from "jsonwebtoken"
import { IUser } from "./custom"

declare global {
    namespace Express {
         interface Request {
            user?: IUser
        }
    }
}