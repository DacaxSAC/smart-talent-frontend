import { FormSection } from "@/features/auth/components/shared/FormSection";
import { GreetingSection } from "@/features/auth/components/shared/GreetingSection";
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