import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormTitle, FormButton, FormInput, FormLayout, AuthRequestMessage } from "@/features/auth/components/shared";
import { Loader } from "@/shared/components/Loader";
import { useUser } from "@/features/auth/hooks/useUser";

/**
 * LoginForm component that handles user authentication
 * Provides email/password login functionality with proper error handling
 */
export const LoginForm = () => {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useUser();

  /**
   * Handle form submission and user authentication
   * @param e - Form submission event
   */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Todos los campos son requeridos");
      return;
    }
    setLoading(true);
    setError(null);

    const response = await login({
      email: formData.email,
      password: formData.password,
    });

    if(response.success){
      navigate('/');
    }else{
      setError(response.message);
    }
    
    console.log(response);

    setLoading(false);
  };

  return (
    <>
      <Loader isLoading={loading} />

      <FormTitle
        title="Iniciar sesión"
        description="Por favor ingresa tus datos"
      />

      {/* Global error message */}
      {error && (
        <AuthRequestMessage isError={true} text={error}/>
      )}

      <FormLayout onSubmit={handleLogin}>
        <FormInput
          value={formData.email}
          labelValue="Email"
          handleChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
          }}
          type="email"
        />

        <FormInput
          value={formData.password}
          labelValue="Contraseña"
          handleChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
          }}
          type="password"
        >
          <div className="flex justify-between items-center">
            <Link
              to="/recovery-password"
              className="text-medium cursor-pointer hover:text-main transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </FormInput>

        <FormButton
          text={loading ? "Ingresando..." : "Ingresar"}
          disabled={loading}
        />
      </FormLayout>
    </>
  );
};
