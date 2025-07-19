import { FormLayout } from "@/features/auth/components/shared/FormLayout";
import { FormInput } from "@/features/auth/components/shared/FormInput";
import { FormButton } from "@/features/auth/components/shared/FormButton";
import { FormTitle } from "@/features/auth/components/shared/FormTitle";

export const RecoveryForm = () =>{
    const handleSubmit = () =>{
        console.log('send')
    }

    return(
        <>
            <FormTitle title="Recuperar contraseña" description="Ingresa tu email para poder recuperar tu contraseña" />

            <FormLayout handlelogin={handleSubmit}>
                <FormInput error={'error'} handleError={()=>console.log('add a method')} text="Email" type="email">
                    <p className="text-medium">📩 Te enviaremos un mensaje a tu correo. </p>
                </FormInput>
                <FormButton disabled={false} text="Solicitar enlace de recuperación"/>
            </FormLayout>
        </>
    );
}