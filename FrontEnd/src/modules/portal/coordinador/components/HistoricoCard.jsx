import ModalEliminar from '@/modules/core/components/ModalEliminar'
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';
import { useDisclosure } from '@nextui-org/react';
import { FileText, Hash } from 'lucide-react';
import React from 'react'
import { useFile } from '../states/FileContext';
import { useUsers } from '@/modules/core/states/UsersContext';

export const HistoricoCard = ({users}) => {
  const { saveFileData } = useFile();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setActiveComponentById } = useActiveComponent()
  const { removeUser } = useUsers();

  const deleteDataHistorico = () => {
    removeUser(users.id_usuario);
    onOpenChange(false);
  };

  return (
    <div className='w-[350px] flex flex-col gap-4 p-4 border rounded-xl hover:cursor-pointer'
      
      onClick={() => {
        saveFileData(users.data);
        setActiveComponentById('verHistoricoNotas',`Histórico de Calificaciones de ${users.nombres + ' ' + users.primerApellido}`)}
      }
    >
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>
          {users.nombres + ' ' + users.primerApellido}
        </h3>
        <ModalEliminar
          title='Eliminar Historico de Notas'
          deleteData={deleteDataHistorico}
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
        />
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute 
          icon={<Hash size={20} />} 
          text={users.codigo} />
        <CardAttribute
          icon={<FileText size={20} />}
          text={users.size+' Kb'}
        />
      </div>
    </div>
  )
}
