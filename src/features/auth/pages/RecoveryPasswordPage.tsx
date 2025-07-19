import { FormSection } from "@/features/auth/components/shared/FormSection"
import { GreetingSection } from "@/features/auth/components/shared/GreetingSection"
import { RecoveryForm } from "@/features/auth/components/private/recovery-password/RecoveryForm"

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