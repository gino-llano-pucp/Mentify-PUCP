import { useActiveComponent } from '../states/ActiveComponentContext';
import { componentMapping } from '../lib/componentMapping';
import { Button } from '@nextui-org/react';

function UseButton({ className, color, variant, startContent, text, componentId, componentName }) {
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
    <Button
      className={className}
      color={color}
      variant={variant}
      startContent={startContent}
      onClick={() => handleComponentChange(componentId, componentName)}
    >
      {text}
    </Button>
  );
}

export default UseButton;
