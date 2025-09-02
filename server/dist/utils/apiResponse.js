"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    res;
    constructor(res) {
        this.res = res;
    }
    success(data, message = 'Success', statusCode = 200) {
        this.res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    error(error, statusCode = 500) {
        const message = error instanceof Error ? error.message : 'An error occurred';
        this.res.status(statusCode).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
exports.ApiResponse = ApiResponse;
