import { LoginForm } from "@/features/auth/components/private/login/LoginForm";
import { FormSection } from "@/features/auth/components/shared/FormSection";
import { GreetingSection } from "@/features/auth/components/shared/GreetingSection";

export function LoginPage() {
    return (
      <>
        <GreetingSection />

         <FormSection>
            <LoginForm/>
        </FormSection>
      </>
    );
}