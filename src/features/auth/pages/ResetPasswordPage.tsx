import { FormSection } from "../components/shared/FormSection";
import { GreetingSection } from "../components/shared/GreetingSection";
import { ResetForm } from "../components/private/reset-password/ResetForm";

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