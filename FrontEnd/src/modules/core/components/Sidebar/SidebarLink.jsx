'use client';
import { cloneElement, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronUp } from 'lucide-react';
import { componentMapping } from '../../lib/componentMapping';
import { useActiveComponent } from '../../states/ActiveComponentContext';

const SidebarLink = ({
  icon,
  children,
  componentId,
  setActiveComponent,
  variant = 'simple',
  sublinks = [],
  isSelected,
  onClick,
  setSelectedId,
  selectedId
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setActiveComponentById } = useActiveComponent();

  const handleClick = () => {
    if (variant === 'complex') {
      setIsExpanded(!isExpanded);
    } else if (componentId) {
      // simple y sublink
      /* setActiveComponent(componentId); */
      setActiveComponentById(componentId, children, true);
      //setIsSelected(!isSelected);
      onClick();
    }
  };

  return (
    <div className='flex flex-col py-1 hover:cursor-pointer w-full'>
      {/* Link behaves differently based on the variant */}
      {variant === 'simple' ? (
        <div
          className={`py-3 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-[#F2F2F2] ${isSelected ? 'text-[#00C1BC]' : ''} flex items-center justify-center w-full gap-2 md:justify-normal`}
          onClick={handleClick}
        >
          <div className='flex flex-row items-center w-full gap-3'>
            {cloneElement(icon, {
              className: `h-5 w-5 ${isSelected ? 'text-[#00C1BC]' : 'text-[#555555]'}`
            })}
            <span className={`block ${isSelected ? 'text-[#00C1BC]' : 'text-[#555555]'} text-[13px]`}>
              {children}
            </span>
          </div>
        </div>
      ) : variant === 'complex' ? (
        <div
          className={`py-3 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-[#F2F2F2] flex items-center justify-center w-full gap-2 md:justify-normal`}
          onClick={handleClick}
        >
          <div className='flex flex-row items-center w-full gap-3'>
            {cloneElement(icon, {
              className: `h-5 w-5 ${isSelected ? 'text-[#00C1BC]' : 'text-[#555555]'}`
            })}
            <span className='block text-[#555555] text-[13px]'>{children}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className='block text-[#555555]' size={24} />
          ) : (
            <ChevronDown className='block text-[#555555]' size={24} />
          )}
        </div>
      ) : (
        <div
          className={`px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-[#F2F2F2] flex items-center justify-center w-full gap-2 md:justify-normal`}
          onClick={handleClick}
        >
          <div className='flex items-center justify-between w-full gap-3'>
            <div className='w-8 h-8 md:h-8 md:w-8'></div>
            <span className={`block  ${isSelected ? 'text-[#00C1BC]' : 'text-[#555555]'} text-[13px] w-full`}>{children}</span>
            {isSelected ? (
              <ChevronLeft className='text-[#00C1BC]' size={24} />
            ) : (
              <div className='w-8 h-8 md:h-6 md:w-6'></div>
            )}
          </div>
        </div>
      )}

      {/* Renderiza sublinks cuando se expande el padre */}
      {variant === 'complex' && isExpanded && (
        <div className=''>
          {sublinks.map((sublink, index) => (
            <SidebarLink
              key={sublink.id}
              componentId={sublink.componentId}
              setActiveComponent={setActiveComponent}
              variant='sublink'
              isSelected={sublink.id === selectedId}
              onClick={() => setSelectedId(sublink.id)}
            >
              {sublink.label}
            </SidebarLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarLink;
