import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbUserFilled } from 'react-icons/tb';
import { useUser } from '@/features/auth/hooks/useUser';
import { useModalStore } from '@/shared/store/modalStore';
import { Logotipo } from './Logotipo';
import { ThemeSwitch } from './ThemeSwitch';
import { SidebarToggle } from './SidebarToggle';
import { PaperIcon, RecruitmentIcon, PayIcon, AddIcon, ListIcon, ExitIcon, DocPendingIcon, DocOnProcessIcon, DocTerminatedIcon } from '@/shared/icons';
import { ROLES } from '@/features/auth/constants/roles';
import { MdExpandMore } from 'react-icons/md';


export const Sidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { setIsActiveDrawerRegisterRequests } = useModalStore();

  const isAdmin = user?.roles.includes(ROLES.ADMIN);
  const isUser = user?.roles.includes(ROLES.USER);
  const isRecruiter = user?.roles.includes(ROLES.RECRUITER);

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarItems = [
    {
      icon: <TbUserFilled className='w-[25px] h-[25px] text-black-2 dark:text-white-1' />,
      label: 'Gestión de usuarios',
      onClick: () => navigate('/users'),
      hasSubItems: false,
      showCondition: isAdmin,
    },
    {
      icon: <PaperIcon width={30} height={30} className='text-black-2 dark:text-white-1' />,
      label: 'Solicitudes',
      hasSubItems: true,
      subItems: [
        {
          icon: <AddIcon width={30} height={30} className='text-black-2 dark:text-white-1' />,
          label: 'Agregar nueva solicitud',
          onClick: () => {
            navigate('/requests');
            setIsActiveDrawerRegisterRequests(true);
          },
          showCondition: isUser
        },
        {
          icon: <ListIcon width={30} height={30} className='text-black-2 dark:text-white-1' />,
          label: 'Lista de solicitudes',
          onClick: () => navigate('/requests'),
          showCondition: isUser
        },
        {
          icon: <DocPendingIcon width={30} height={30} className='text-black-2 dark:text-white-1' />,
          label: 'Solicitudes pendientes',
          onClick: () => {
            navigate('/requests-pending');
            setIsActiveDrawerRegisterRequests(true);
          },
          showCondition: isAdmin || isRecruiter
        },
        {
          icon: <DocOnProcessIcon width={30} height={30} className='text-black-2 dark:text-white-1' />,
          label: 'Solicitudes en proceso',
          onClick: () => {
            navigate('/requests-on-process');
            setIsActiveDrawerRegisterRequests(true);
          },
          showCondition: isAdmin || isRecruiter
        },
        {
          icon: <DocTerminatedIcon width={30} height={30} className='text-black-2 dark:text-white-1' />,
          label: 'Solicitudes terminadas',
          onClick: () => {
            navigate('/requests-terminated');
            setIsActiveDrawerRegisterRequests(true);
          },
          showCondition: isAdmin || isRecruiter
        },
      ]
    },
    {
      icon: <RecruitmentIcon width={30} height={30} className='text-black-2 dark:text-white-1' />,
      label: 'Reclutamientos',
      hasSubItems: true,
      subItems: [
        {
          icon: <AddIcon className="w-[30px] h-[30px] text-black-2 dark:text-white-1" />,
          label: 'Agregar nuevo reclutamiento',
          onClick: () => navigate('/recruitments'),
          showCondition: isUser
        },
        {
          icon: <ListIcon className="w-[30px] h-[30px] text-black-2 dark:text-white-1" />,
          label: 'Lista de reclutamientos',
          onClick: () => navigate('/recruitments'),
          showCondition: isUser
        },
        {
          icon: <DocPendingIcon className="w-[30px] h-[30px] text-black-2 dark:text-white-1" />,
          label: 'Reclutamientos pendientes',
          onClick: () => navigate('/recruitments-pending'),
          showCondition: isAdmin || isRecruiter
        },
        {
          icon: <DocOnProcessIcon className="w-[30px] h-[30px] text-black-2 dark:text-white-1" />,
          label: 'Reclutamientos en proceso',
          onClick: () => navigate('/recruitments-on-process'),
          showCondition: isAdmin || isRecruiter
        },
        {
          icon: <DocTerminatedIcon className="w-[30px] h-[30px] text-black-2 dark:text-white-1" />,
          label: 'Reclutamientos terminados',
          onClick: () => navigate('/recruitments-terminated'),
          showCondition: isAdmin || isRecruiter
        },
      ]
    },
    {
      icon: <PayIcon className='w-[30px] h-[30px] text-black-2 dark:text-white-1' />,
      label: 'Historial de facturación',
      hasSubItems: false,
      onClick: () => navigate('/billing-history')
    },
    {
      icon: <ExitIcon className="w-[30px] h-[30px] text-black-2 dark:text-white-1" />,
      label: 'Cerrar Sesión',
      hasSubItems: false,
      onClick: handleLogout
    }
  ];

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
          {sidebarItems.map((item, index) => {
             if (item.showCondition === false) return null;
             
             return (
               <SidebarItem
                 key={index}
                 icon={item.icon}
                 label={item.label}
                 hasSubItems={item.hasSubItems}
                 subItems={item.subItems}
                 onClick={item.onClick}
                 showCondition={item.showCondition}
                 isLastItem={index === sidebarItems.length - 1}
               />
             );
           })}
        </div>
      </aside>

      <SidebarToggle handleIsOpen={handleIsOpen} />
    </>
  );
};


interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  hasSubItems?: boolean;
  subItems?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    showCondition?: boolean;
  }>;
  onClick?: () => void;
  showCondition?: boolean;
  isLastItem?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  hasSubItems = false,
  subItems = [],
  onClick,
  showCondition = true,
  isLastItem = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    if (hasSubItems) {
      toggleMenu();
    } else if (onClick) {
      onClick();
    }
  };

  if (!showCondition) {
    return null;
  }

  return (
    <div>
      <div
        className={`w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium px-6 cursor-pointer ${isLastItem ? 'mb-14' : ''}`}
        onClick={handleClick}
      >
        {icon}
        {label}
        {hasSubItems && (
          <span className="ml-auto">
            <div className={`transition-all duration-300 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
              <MdExpandMore className="w-[25px] h-[25px] text-black-2 dark:text-white-1" />
            </div>
          </span>
        )}
      </div>

      {hasSubItems && isOpen && (
        <div className="transition-all duration-300 ease-in-out">
          {subItems.map((subItem, index) => (
            <SidebarSubItem
              key={index}
              icon={subItem.icon}
              label={subItem.label}
              onClick={subItem.onClick}
              showCondition={subItem.showCondition}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarSubItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  showCondition?: boolean;
}

export const SidebarSubItem: React.FC<SidebarSubItemProps> = ({
  icon,
  label,
  onClick,
  showCondition = true
}) => {
  if (!showCondition) {
    return null;
  }

  return (
    <div
      onClick={onClick}
      className='w-full flex flex-row justify-start items-center gap-2 py-3.5 hover:bg-white-2 dark:hover:bg-black-2 border-b border-medium dark:border-black-1 bg-white dark:bg-black px-10 cursor-pointer'
    >
      {icon}
      {label}
    </div>
  );
};