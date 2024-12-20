import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment.development";

export class UtilMethods {

    public static getFieldJwtToken(field: string): string {
        const decodeToken = this.getDecodedJwtToken();
        if (decodeToken) {
            if (field in decodeToken) {
                return decodeToken[field];
            }
            return "";
        }
        else {
            return null;
        }
    }

    public static isTokenExpired(): boolean {
        const helper = this.getHelper();
        let token = this.getJwtToken();

        return helper.isTokenExpired(token);
    }

    public static getJwtToken(): string {
        let token = localStorage.getItem(environment.TOKEN_NAME);
        return token;
    }

    public static getDecodedJwtToken(): any {
        let token = this.getJwtToken();
        return this.extractJwtPayload(token);
    }

    public static extractJwtPayload(token: string): any {
        if (!token) {
            return null;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }

        try {
            const helper = this.getHelper();
            const decodedToken = helper.decodeToken(token);

            return decodedToken;
        } catch (e) {
            return null;
        }
    }

    public static getHelper(): JwtHelperService {
        return new JwtHelperService();
    }

    public static generateRandomCode(): string {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';

        let code = '';

        for (let i = 0; i < 3; i++) {
            const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
            code += randomLetter;
        }

        for (let i = 0; i < 3; i++) {
            const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
            code += randomNumber;
        }

        return code;
    }
}