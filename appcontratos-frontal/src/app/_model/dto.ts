export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface ChangeStatusRequest {
    id: number;
    estado: boolean;
}