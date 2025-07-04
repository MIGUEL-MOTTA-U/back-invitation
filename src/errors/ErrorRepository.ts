import { ErrorType } from "../types";
import ErrorTemplate from "./ErrorTemplate";

class ErrorRepository extends ErrorTemplate{
    public static readonly NOT_FOUND:ErrorType = { message: "DATA NOT FOUND", code: 404 }
    public static readonly ALREADY_EXISTS:ErrorType = { message: "CONFLICT, DATA ALREADY EXISTS", code: 409 }
    public static readonly SERVER_ERROR:ErrorType = { message: "SERVER ERROR", code: 500 }
    public static readonly CONFLICT_REPEATED_DATA:ErrorType = { message: "CONFLICT, REPEATED DATA", code: 409 }
}
export default ErrorRepository;