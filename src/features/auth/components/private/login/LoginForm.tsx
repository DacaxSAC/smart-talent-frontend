import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormTitle } from "../../shared/FormTitle";
import { FormLayout } from "../../shared/FormLayout";
import { FormInput } from "../../shared/FormInput";
import { FormButton } from "../../shared/FormButton";
import { Loader } from "@/shared/components/Loader";
import { useUser } from "@/features/auth/hooks/useUser";

/**
 * LoginForm component that handles user authentication
 * Provides email/password login functionality with proper error handling
 */
export const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email: string | null;
    password: string | null;
  }>({ email: null, password: null });

  const navigate = useNavigate();
  const { login } = useUser();

  /**
   * Clear all errors when user starts typing
   */
  const clearError = () => {
    setError(null);
    setFieldErrors({ email: null, password: null });
  };

  /**
   * Validate form fields
   * @param email - User email
   * @param password - User password
   * @returns boolean indicating if form is valid
   */
  const validateForm = (email: string, password: string): boolean => {
    const errors = {
      email: null as string | null,
      password: null as string | null,
    };
    let isValid = true;

    if (!email || !email.trim()) {
      errors.email = "El email es requerido";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Formato de email inválido";
      isValid = false;
    }

    if (!password || !password.trim()) {
      errors.password = "La contraseña es requerida";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  /**
   * Handle form submission and user authentication
   * @param e - Form submission event
   */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);
    setFieldErrors({ email: null, password: null });

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    // Validate form
    if (!validateForm(email, password)) {
      return;
    }

    setLoading(true);

    try {
      const success = await login({ email, password });

      if (success) {
        // Successful login - navigate to requests page
        navigate("/requests", { replace: true });
      } else {
        // Login failed - show error message
        setError(
          "Credenciales inválidas. Por favor verifica tu email y contraseña."
        );
      }
    } catch (error: any) {
      // Handle unexpected errors
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setError(
          "Credenciales inválidas. Por favor verifica tu email y contraseña."
        );
      } else if (error.response?.status === 429) {
        setError("Demasiados intentos de login. Por favor intenta más tarde.");
      } else if (error.code === "NETWORK_ERROR") {
        setError(
          "Error de conexión. Por favor verifica tu conexión a internet."
        );
      } else {
        setError(
          error.message || "Error inesperado. Por favor intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
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
        <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      <FormLayout handlelogin={handleLogin}>
        <FormInput
          handleError={clearError}
          error={fieldErrors.email}
          text="Email"
          type="email"
        />

        <FormInput
          handleError={clearError}
          error={fieldErrors.password}
          text="Contraseña"
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
