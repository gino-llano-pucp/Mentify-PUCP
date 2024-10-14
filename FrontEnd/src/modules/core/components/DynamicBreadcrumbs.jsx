'use client';
import { useActiveComponent } from '../states/ActiveComponentContext';
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';

const DynamicBreadcrumbs = () => {
  const { navigationHistory, setActiveComponentFromBreadcrumb } = useActiveComponent();
  const handleBreadcrumbClick = (index) => {
    setActiveComponentFromBreadcrumb(index);
  };

  return (
    <Breadcrumbs className='px-4 py-4 md:px-12'>
      {navigationHistory.map((item, index) => (
        <BreadcrumbItem key={index} onClick={() => handleBreadcrumbClick(index)}>
          {item.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;
