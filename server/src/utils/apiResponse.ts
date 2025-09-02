import { Response } from 'express';

export class ApiResponse {
    constructor(private res: Response) { }

    success(data: any, message: string = 'Success', statusCode: number = 200) {
        this.res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    error(error: any, statusCode: number = 500) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        this.res.status(statusCode).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}