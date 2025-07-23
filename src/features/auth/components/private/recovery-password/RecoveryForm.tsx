import { useState } from "react";
import { FormLayout } from "@/features/auth/components/shared/FormLayout";
import { FormInput } from "@/features/auth/components/shared/FormInput";
import { FormButton } from "@/features/auth/components/shared/FormButton";
import { FormTitle } from "@/features/auth/components/shared/FormTitle";
import { AuthService } from "@/features/auth/services/authService";

export const RecoveryForm = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.requestPasswordReset(email);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <FormTitle
        title="Recuperar contraseña"
        description="Ingresa tu email para poder recuperar tu contraseña"
      />

      <FormLayout onSubmit={handleSubmit}>
        <FormInput
          labelValue="Email"
          type="email"
          value={email}
          handleChange={(e) => setEmail(e.target.value)}
        >
          <p className="text-medium">
            📩 Te enviaremos un mensaje a tu correo.{" "}
          </p>
        </FormInput>
        <FormButton disabled={loading} text="Solicitar enlace de recuperación" />
      </FormLayout>
    </>
  );
};
