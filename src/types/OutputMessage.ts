interface OutputMessage {
    type: string;
    status: number;
    message: string;
    payload?: unknown;
}

export default OutputMessage;