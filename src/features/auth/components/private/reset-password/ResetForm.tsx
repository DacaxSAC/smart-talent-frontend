import { FormButton } from "@/features/auth/components/shared/FormButton";
import { FormInput } from "@/features/auth/components/shared/FormInput";
import { FormLayout } from "@/features/auth/components/shared/FormLayout";
import { FormTitle } from "@/features/auth/components/shared/FormTitle";

export const ResetForm = () => {
    const handleSubmit = () =>{
        console.log('send')
    }

    return(
        <>
            <FormTitle title="Restablecer contraseña" description="Ingresa tu nueva contraseña" />

            <FormLayout handlelogin={handleSubmit}>
                <FormInput error={'error'} handleError={()=>console.log('add a method')} text="Nueva contraseña" type="password"/>
                <FormInput error={'error'} handleError={()=>console.log('add a method')} text="Confirmar nueva contraseña" type="password">
                    <p className="text-medium">✅  Las contraseñas deben coincidir</p>
                </FormInput>
                <FormButton disabled={false} text="Restablecer contraseña"/>
            </FormLayout>
        </>
    );
}