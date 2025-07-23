import { useNavigate } from "react-router-dom";

export const ButtonToLogin = () => {
  const navigate = useNavigate();
  return (
    <button
      className="text-[20px] text-center
                bg-main 
                hover:opacity-80 
                border border-medium
                rounded-[15px] 
                px-4 py-2 
                mt-2 mb-4 
                w-full 
                cursor-pointer"
      disabled={false}
      onClick={() => navigate("/login")}
    >
      Ir a login
    </button>
  );
};
