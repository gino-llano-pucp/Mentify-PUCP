'use client';
import { Hash, Mail, Info, Pencil, Book } from 'lucide-react';
import { Tooltip, Button } from '@nextui-org/react';
import CardAttribute from '@/modules/admin/components/CardAttribute';
import ModalEliminar from './ModalEliminar';
import { useState } from 'react';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { componentMapping } from '@/modules/core/lib/componentMapping';
import ModalActivar from './ModalActivar';

function TipoTutoriaCard({ types }) {
  const [isActive, setActive] = useState(types.esActivo);
  const { setActiveComponent } = useActiveComponent();

  const handleEdit = () => {
    clearFields();
    const Component = componentMapping['addTutoringType'];
    if (Component) {
      // Create the component instance only when needed
      const componentInstance = <Component />;
      console.log('Activating component:', 'Agregar Tipo de Tutoría');
      setActiveComponent(componentInstance, 'Agregar Tipo de Tutoría');
    }
  };

  return (
    <div className='w-[360px] flex flex-col gap-4 p-4 border rounded-xl'>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-sm font-semibold break-words'>
          {types.nombre}
        </h3>
        {isActive ? (
          <div className='flex flex-row gap-1'>
            {Eliminar === false ? (
              ''
            ) : (
              <Tooltip content='Editar Tipo de Tutoría' color='foreground' closeDelay={100}>
                <Button
                  isIconOnly
                  color='default'
                  variant='light'
                  aria-label='Editar Tipo de Tutoría'
                  onClick={handleEdit}
                >
                  <Pencil size={16} />
                </Button>
              </Tooltip>
            )}

            <ModalEliminar
              title={`Eliminar Tipo de Tutoría`}
              id_data={types.id_tipo}
              action={Eliminar}
              componentName={componentName}
              setActive={setActive}
            />
          </div>
        ) : (
          <div className='flex flex-row gap-1'>
            <ModalActivar
              title={`Activar ${queVaEliminar}`}
              id_data={types.id_usuario}
              setActive={setActive}
            />
          </div>
        )}
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute icon={<Hash size={20} />} text={types.codigo} />
        <CardAttribute
          className={queVaEliminar === 'Tutor' ? 'hidden' : ''}
          icon={<Book size={20} />}
          text={types.Facultad === null ? '' : types.Facultad.nombre}
        />
        <CardAttribute icon={<Mail size={20} />} text={types.email} />
        <CardAttribute icon={<Info size={20} />} text={isActive ? 'Activo' : 'Inactivo'} />
      </div>
    </div>
  );
}

export default TipoTutoriaCard;
