import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/features/auth/services/authService";
import { FormButton, FormInput, FormLayout, FormTitle, AuthRequestMessage, ButtonToLogin } from "@/features/auth/components/shared";
import { Loader } from "@/shared/components/Loader";

export const ResetForm = ({token}: {token: string}) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(password !== confirmPassword){
            setMessage('Las contraseñas no coinciden');
            setIsError(true);
            return;
        }
        setIsLoading(true);
        try {
            const response = await AuthService.resetPassword({token, newPassword: password});
            if(response.success){
                setMessage(response.message);
                setIsError(false);
                setDisabled(true);
            } else {
                setMessage(response.message);
                setIsError(true);
            }
        } catch (error) {
            setMessage('Error al restablecer la contraseña. Intenta nuevamente.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }

    }

    return(
        <>
            <Loader isLoading={isLoading} />
            <FormTitle title="Restablecer contraseña" description="Ingresa tu nueva contraseña" />

            {message && <AuthRequestMessage isError={isError} text={message} />}

            {disabled && ( <ButtonToLogin />)}

            <FormLayout onSubmit={handleSubmit}>
                <FormInput disabled={disabled} value={password} handleChange={(e) => setPassword(e.target.value)} labelValue="Nueva contraseña" type="password"/>
                <FormInput disabled={disabled} value={confirmPassword} handleChange={(e) => setConfirmPassword(e.target.value)} labelValue="Confirmar nueva contraseña" type="password">
                    <p className="text-medium">✅  Las contraseñas deben coincidir</p>
                </FormInput>
                <FormButton disabled={disabled} text="Restablecer contraseña"/>
            </FormLayout>
        </>
    );
}