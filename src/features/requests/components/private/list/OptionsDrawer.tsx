import { useNavigate } from 'react-router-dom';
import { Button } from "@/shared/components/Button";
import { Drawer } from "@/shared/components/Drawer";

interface OptionsModalProps {
  isActive: boolean;
  handleActive: () => void;
}

export const OptionsDrawer = ({ isActive, handleActive }: OptionsModalProps) => {
  const navigate = useNavigate();

  const handleRegisterManually = () => {
    handleActive(),
      navigate("/requests/create")
  }

  const handleImportFile = () => {
    // TODO: Importar archivo
  }

  const handleLoadTemplate = () => {
    // TODO: Descargar plantilla
  }

  return (
    <Drawer isActive={isActive} handleActive={handleActive}>
      <div className="flex flex-col items-center justify-center gap-5 mb-10">
        <p className="text-center text-[12px] font-light">
          SELECCIONA EL MÉTODO DE INGRESO DE DATOS
        </p>

        <div className="flex flex-col gap-3 w-full max-w-md">
          <Button type='primary' handleClick={handleRegisterManually} description="Registrar manualmente" />
          <p className="text-center text-[12px] font-light">O</p>
          <Button type='primary' handleClick={handleImportFile} description="Importar archivo" />
          {/* <Button type='secondary' handleClick={handleLoadTemplate} description="Descargar plantilla" /> */}
        </div>
      </div>
    </Drawer>
  );
};


