import React, { useState } from 'react';
import { Tooltip } from '@nextui-org/react';

const CopyToClipboard = ({ text }) => {
  const [tooltipContent, setTooltipContent] = useState('Copiar a portapapeles');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setTooltipContent('Copiado!');
      setTimeout(() => setTooltipContent('Copiar a portapapeles'), 2000); // Reset tooltip text after 2 seconds
    } catch (err) {
      setTooltipContent('Error al copiar');
      setTimeout(() => setTooltipContent('Copiar a portapapeles'), 2000);
    }
  };

  return (
    <Tooltip content={<span className="px-1 py-2">{tooltipContent}</span>} size='sm'>
      <span className='text-sm truncate' onClick={handleCopy} style={{ cursor: 'pointer' }}>
        {text}
      </span>
    </Tooltip>
  );
};

export default CopyToClipboard;
