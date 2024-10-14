import { cn } from '@/modules/core/lib/utils';
import { cva } from 'class-variance-authority';
import { useActiveComponent } from '../states/ActiveComponentContext';
import { componentMapping } from '../lib/componentMapping';

const linkVariants = cva(
  'inline-flex items-center whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'transition-colors hover:text-foreground',
        bc: 'hover:text-[#00C1BC] text-[#71717A]',
        bcActive: 'pointer-events-none text-[#00C1BC]',
        btContent:
          'h-9 w-40 text-[#00C1BC] hover:text-white bg-white hover:bg-[#00C1BC] rounded-md border-2 border-[#00C1BC] hover:border-white justify-center',
        btCancelar:
          'h-9 w-40 text-[#FF4545] hover:text-white bg-white hover:bg-[#FF4545] rounded-md border-2 border-[#FF4545] hover:border-white justify-center',
        btCard: 'text-[#00C1BC] hover:text-white bg-white hover:bg-[#00C1BC] justify-center',
        btCargar: 'h-9 w-44 text-white bg-[#00C1BC] rounded-md border-2 border-[#00C1BC] justify-center'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export default function UseLink({ componentId, componentName, className, variant, text, icon }) {
  const { setActiveComponent } = useActiveComponent();

  const handleComponentChange = (componentId, componentName) => {
    const Component = componentMapping[componentId];
    if (Component) {
      // Create the component instance only when needed
      const componentInstance = <Component />;
      console.log('Activating component:', componentName);
      setActiveComponent(Component, componentName);
    }
  };

  return (
    <button
      className={cn(linkVariants({ variant, className }))}
      onClick={() => handleComponentChange(componentId, componentName)}
    >
      {icon}
      {text}
    </button>
  );
}
