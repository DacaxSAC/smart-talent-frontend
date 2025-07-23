import { useState } from "react";
import { AuthService } from "@/features/auth/services/authService";
import { FormLayout, FormButton, FormInput, FormTitle, AuthRequestMessage } from "@/features/auth/components/shared";
import { Loader } from "@/shared/components/Loader";

export const RecoveryForm = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageFromResponse, setMessageFromResponse] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.requestPasswordReset(email);
      setMessageFromResponse(response.message);
      setIsError(false);
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setIsError(true);
        setMessageFromResponse(error.message);
      } else {
        setIsError(true);
        setMessageFromResponse("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader isLoading={loading} />
      <FormTitle
        title="Recuperar contraseña"
        description="Ingresa tu email para poder recuperar tu contraseña"
      />

      {messageFromResponse && (
        <AuthRequestMessage text={messageFromResponse} isError={isError} />
      )}

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
        <FormButton
          disabled={loading}
          text="Solicitar enlace de recuperación"
        />
      </FormLayout>
    </>
  );
};
