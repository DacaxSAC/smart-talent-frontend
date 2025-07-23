import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FormSection, GreetingSection, FormTitle } from "@/features/auth/components/shared";
import { ResetForm } from "@/features/auth/components/private/reset-password/ResetForm";
import { AuthService } from "../services/authService";
import { Loader } from "@/shared/components/Loader";

/**
 * Página para restablecer contraseña con validación de token
 * Valida el token de restablecimiento y muestra el formulario o mensaje de error
 */
export function ResetPasswordPage(){
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [isLoading, setIsLoading] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        /**
         * Valida el token de restablecimiento de contraseña
         */
        const validateToken = async () => {
            // Si no hay token en la URL
            if (!token) {
                setErrorMessage('No se proporcionó un token de restablecimiento válido.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await AuthService.validateResetToken(token);
                console.log(response)
                
                // Validar la respuesta del servicio
                if (response.valid) {
                    setIsValidToken(true);
                } else {
                    setErrorMessage(response.message || 'Token de restablecimiento inválido o expirado.');
                }
            } catch (error) {
                console.error('Error validating token:', error);
                setErrorMessage('Error al validar el token. Por favor, solicita un nuevo enlace de restablecimiento.');
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [token]);

    return(
        <>
            <GreetingSection/>
            <FormSection>
                {isLoading ? (
                        <Loader isLoading={true} />
                ) : isValidToken ? (
                    <ResetForm />
                ) : (
                    <FormTitle title="Token Inválido" description={errorMessage} />
                )}
            </FormSection>
        </>
    );
}