import { Button } from '@nextui-org/react';
import Image from 'next/image';
import React, { useState, useRef } from 'react';

const LogoSection = ({ foto, onFileChange, error }) => {
    const [imagePreview, setImagePreview] = useState('/emptyImage.png');
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            onFileChange(file); // Pasa el archivo completo en lugar de un Uint8Array
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

  return (
    <div className='flex flex-col gap-2'>
            <h3 className='text-base font-bold'>Logo</h3>
            <div className='flex flex-col gap-4'>
                <div className='flex-shrink-0'>
                    <div className='relative w-20 h-20 overflow-hidden rounded-full md:w-28 md:h-28 '>
                    <Image
                        src={imagePreview}
                        alt="Institution Logo"
                        fill={true}
                        style={{ objectFit: 'cover' }}
                    />
                    </div>
                </div>
                <div className='flex flex-row items-center gap-2'>
                    <Button color='primary' onPress={() => fileInputRef.current.click()}>
                        Subir logo
                    </Button>
                    <span className='text-normal'>{foto ? foto.name : 'Ningún archivo seleccionado'}</span>
                </div>
                <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                {error && <span className="text-small text-red-500">{error}</span>}
            </div>
    </div>
  )
}

export default LogoSection;
