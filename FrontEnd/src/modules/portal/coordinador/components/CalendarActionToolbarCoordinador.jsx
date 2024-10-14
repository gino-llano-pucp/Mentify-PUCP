import Leyenda from '@/modules/portal/tutor/components/Leyenda';
import { Button } from '@nextui-org/react';
import { CirclePlus, Pencil } from 'lucide-react';
import React from 'react';

const CalendarActionToolbarForCoordinator = ({
    mode,
    handleGuardarEdicionDisponibilidades,
    handleCancelarEditarDisponibilidad,
    handleEditarDisponibilidadClick,
}) => {
    return (
        <div className='flex flex-wrap items-center justify-between gap-2 w-full'>
          <Leyenda />
          <div className='flex flex-row gap-[16px]'>
            {mode === 'editarDisponibilidad' ? (
              <>
                <Button onClick={handleGuardarEdicionDisponibilidades} className='bg-[#008000] text-white'>
                  Guardar cambios
                </Button>
                <Button onClick={handleCancelarEditarDisponibilidad} className='bg-[#FF4545] text-white'>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleEditarDisponibilidadClick} color='primary' startContent={<Pencil size={20} />}>
                  Editar Disponibilidad
                </Button>
              </>
            )}
          </div>
        </div>
    );
}

export default CalendarActionToolbarForCoordinator