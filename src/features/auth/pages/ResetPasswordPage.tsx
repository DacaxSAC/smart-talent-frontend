import { FormSection, GreetingSection } from "@/features/auth/components/shared";
import { ResetForm } from "@/features/auth/components/private/reset-password/ResetForm";

export function ResetPasswordPage(){
    return(
        <>
            <GreetingSection/>
            <FormSection >
                <ResetForm />
            </FormSection>
            
        </>
    );
}