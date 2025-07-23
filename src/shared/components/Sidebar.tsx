import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TbUserPlus, TbUserFilled } from "react-icons/tb";
import { AddIcon, ExitIcon, PaperIcon, PayIcon, RecruitmentIcon, ListIcon } from '@/shared/icons';
import { SidebarToggle } from './SidebarToggle';
import { Logotipo } from './Logotipo';
import { useUser } from '@/features/auth/hooks/useUser'
import { MdExpandMore } from "react-icons/md";
import { ThemeSwitch } from './ThemeSwitch';
import { FaClipboardUser } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useModalStore } from '@/shared/store/modalStore';
import { ROLES } from '@/features/auth/constants/roles';


export const Sidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isRecruitmentsOpen, setIsRecruitmentsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { setIsActiveDrawerRegisterRequests } = useModalStore();

  const isAdmin = user?.roles.includes(ROLES.ADMIN);
  const isUser = user?.roles.includes(ROLES.USER);

  const toggleRequestsMenu = () => {
    setIsRequestsOpen(!isRequestsOpen);
  };

  const toggleRecruitmentsMenu = () => {
    setIsRecruitmentsOpen(!isRecruitmentsOpen);
  };

  const toggleUsersMenu = () => {
    setIsUsersOpen(!isUsersOpen);
  };

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`
          fixed xl:relative inset-y-0 left-0 z-40 
          w-96 h-screen
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 max-w-72' : '-translate-x-full xl:translate-x-0 max-w-72'}
          bg-white dark:bg-black
          flex flex-col items-center 
          pt-14
          text-black dark:text-white 
          font-karla  
          border-r border-medium dark:border-black-1 rounded-r-sidebar shadow-greeting`}
      >
        <div className='w-full flex flex-col items-center mb-5'>
          <Logotipo where='sidebar' />
        </div>

        <div className="flex justify-center items-center gap-4 px-2 py-6 border-t-[1px] border-medium w-full">
          <img className="w-[45px] h-[45px]" src="/images/profile.png" alt="profile" />
          <p className='text-[14px] font-light'>{user?.username}</p>
        </div>
        <div
          className={`w-full flex flex-row justify-between items-center gap-2 text-[14px] font-light  py-3.5 border-t border-medium px-6`}
        >
          <p>Tema del sistema</p>
          <ThemeSwitch />
        </div>

        <div className="flex flex-col w-full border-t border-medium text-[14px] font-light overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [-webkit-scrollbar]:hidden">

          {/* Solicitudes Menu Item */}
          <div>
            <div
              className={`w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium px-6 cursor-pointer`}
              onClick={toggleRequestsMenu}
            >
              <PaperIcon width={30} height={30} className='text-black-2 dark:text-white-1' />
              Solicitudes
              <span className="ml-auto">
                <div className={`transition-all duration-300 transform ${isRequestsOpen ? 'rotate-180' : 'rotate-0'}`}>
                  <MdExpandMore className="w-[25px] h-[25px] text-black-2 dark:text-white-1" />
                </div>
              </span>
            </div>

            {isRequestsOpen && (
              <div className="transition-all duration-300 ease-in-out">
                {isUser &&
                  <div
                    onClick={() => {
                      navigate('/requests');
                      setIsActiveDrawerRegisterRequests(true);
                    }}
                    className='w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium dark:border-black-1 bg-white dark:bg-black px-10 cursor-pointer'>
                    <AddIcon width={30} height={30} className='text-black-2 dark:text-white-1' />
                    Agregar nueva solicitud
                  </div>
                }

                <div
                  onClick={() => navigate('/requests')}
                  className='w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium dark:border-black-1 bg-white dark:bg-black px-10 cursor-pointer'>
                  <ListIcon width={30} height={30} className='text-black-2 dark:text-white-1' />
                  Lista de solicitudes
                </div>
              </div>
            )}
          </div>

          {/* Reclutamientos Menu Item */}
          <div>
            <div
              className={`w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium px-6 cursor-pointer`}
              onClick={toggleRecruitmentsMenu}
            >
              <RecruitmentIcon width={30} height={30} className='text-black-2 dark:text-white-1' />
              Reclutamientos
              <span className="ml-auto">
                <div className={`transition-all duration-300 transform ${isRecruitmentsOpen ? 'rotate-180' : 'rotate-0'}`}>
                  <MdExpandMore className="w-[25px] h-[25px] text-black-2 dark:text-white-1" />
                </div>
              </span>
            </div>

            {isRecruitmentsOpen && (
              <div className="transition-all duration-300 ease-in-out">
                {isUser &&
                  <div
                    onClick={() => {
                      navigate('/recruitments');
                      setIsActiveDrawerRegisterRequests(true);
                    }}
                    className='w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium dark:border-black-1 bg-white dark:bg-black px-10 cursor-pointer'>
                    <AddIcon className="w-[30px] h-[30px] text-black-2 dark:text-white-1" />
                    Agregar nuevo reclutamiento
                  </div>
                }

                <div
                  onClick={() => navigate('/recruitments')}
                  className='w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium dark:border-black-1 bg-white dark:bg-black px-10 cursor-pointer'>
                  <ListIcon className="w-[30px] h-[30px] text-black-2 dark:text-white-1" />
                  Lista de reclutamientos
                </div>
              </div>
            )}
          </div>

          {/* Facturación Menu Item */}
          <div
            className={`w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium px-6 cursor-pointer`}
          >
            <PayIcon className='w-[30px] h-[30px] text-black-2 dark:text-white-1' />
            Historial de facturación
          </div>

          {isAdmin &&
            (<div>
              <div
                className={`w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium px-6 cursor-pointer`}
                onClick={toggleUsersMenu}
              >
                <TbUserFilled className='w-[25px] h-[25px] text-black-2 dark:text-white-1' />
                Usuarios
                <span className="ml-auto">
                  <div className={`transition-all duration-300 transform ${isUsersOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <MdExpandMore className="w-[25px] h-[25px] text-black-2 dark:text-white-1" />
                  </div>
                </span>
              </div>

              {isUsersOpen && (
                <div className="transition-all duration-300 ease-in-out">
                  <button onClick={() => navigate('/users')} className='w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 bg-white dark:bg-black dark:hover:bg-black-2 border-b border-medium dark:border-black-1 px-10 cursor-pointer'>
                    <FaClipboardUser className="w-[25px] h-[25px] text-black-2 dark:text-white-1" />
                    Lista de Usuarios
                  </button>
                  <Link
                    to={'/users/create'}
                    className='w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium dark:border-black-1 bg-white dark:bg-black px-10 cursor-pointer'>
                    <TbUserPlus className="w-[25px] h-[25px] text-black-2 dark:text-white-1" />
                    Crear Usuario
                  </Link>
                </div>
              )}
            </div>)}

          {/* Cerrar Sesión Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium px-6 cursor-pointer mb-14`}
          >
            <ExitIcon className="w-[30px] h-[30px] text-black-2 dark:text-white-1" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <SidebarToggle handleIsOpen={handleIsOpen} />
    </>
  );
};