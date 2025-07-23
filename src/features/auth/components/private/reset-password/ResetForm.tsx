import { useState } from "react";
import { FormButton, FormInput, FormLayout, FormTitle, AuthRequestMessage } from "@/features/auth/components/shared";
import { Loader } from "@/shared/components/Loader";

export const ResetForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(password !== confirmPassword){
            setMessage('Las contraseñas no coinciden');
            setIsError(true);
            return;
        }
    }

    return(
        <>
            <Loader isLoading={isLoading} />
            <FormTitle title="Restablecer contraseña" description="Ingresa tu nueva contraseña" />

            {message && <AuthRequestMessage isError={isError} text={message} />}

            <FormLayout onSubmit={handleSubmit}>
                <FormInput value={password} handleChange={(e) => setPassword(e.target.value)} labelValue="Nueva contraseña" type="password"/>
                <FormInput value={confirmPassword} handleChange={(e) => setConfirmPassword(e.target.value)} labelValue="Confirmar nueva contraseña" type="password">
                    <p className="text-medium">✅  Las contraseñas deben coincidir</p>
                </FormInput>
                <FormButton disabled={false} text="Restablecer contraseña"/>
            </FormLayout>
        </>
    );
}