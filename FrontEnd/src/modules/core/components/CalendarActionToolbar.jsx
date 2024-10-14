import Leyenda from '@/modules/portal/tutor/components/Leyenda';
import { Button } from '@nextui-org/react';
import { CirclePlus, Pencil } from 'lucide-react';
import React from 'react';

const CalendarActionToolbar = ({
    mode,
    handleGuardarEdicionDisponibilidades,
    handleCancelarEditarDisponibilidad,
    handleEditarDisponibilidadClick,
    handleNuevaSesionEvent,
    handleGuardarCitas
}) => {
    return (
        <div className='flex flex-wrap items-center justify-between gap-2'>
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
            ) : mode === 'registrarCita' ? (
              <Button onClick={handleGuardarCitas} className='bg-[#008000] text-white'>
                Terminar
              </Button>
            ) : (
              <>
                <Button onClick={handleEditarDisponibilidadClick} color='primary' startContent={<Pencil size={20} />}>
                  Editar Disponibilidad
                </Button>
                <Button onClick={handleNuevaSesionEvent} color='primary' startContent={<CirclePlus size={20} />}>
                  Nuevo
                </Button>
              </>
            )}
          </div>
        </div>
    );
}

export default CalendarActionToolbar