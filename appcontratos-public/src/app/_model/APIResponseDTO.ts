export interface APIResponseDTO<T> {
    success: boolean;
    message: string;
    data: T;
    statusCode: number;
    timestamp: string;
}