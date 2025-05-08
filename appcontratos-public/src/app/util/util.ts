import { DetalleMaterial, Material } from "../_model/material";

export class UtilMethods {
    public static buscarMaterialSeleccionado(materiales: Material[], detalleMaterial: DetalleMaterial) {
        let materialSeleccionado: Material | null = null;
        for (const material of materiales) {
            for (const color of material.detalles) {
                if (color.id === detalleMaterial.id) {
                    materialSeleccionado = material;
                    break;
                }
            }
        }

        return materialSeleccionado;
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