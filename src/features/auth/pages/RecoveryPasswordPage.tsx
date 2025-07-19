import { FormSection } from "../components/shared/FormSection"
import { GreetingSection } from "../components/shared/GreetingSection"
import { RecoveryForm } from "../components/private/recovery-password/RecoveryForm"

export function RecoveryPasswordPage(){
    return(
        <>
            <GreetingSection />
            <FormSection>
                <RecoveryForm/>
            </FormSection>
        </>
    )
}