import { ErrorType } from "../types"
class ErrorTemplate extends Error{
    public readonly code:number;
    public readonly details: string;
    public constructor(error: ErrorType, details:string) {
        super(error.message);
        this.code = error.code;
        this.details = details;
    }
}

export default ErrorTemplate;