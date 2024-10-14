"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@nextui-org/react';
import { CalendarIcon, Eye, EyeIcon } from 'lucide-react';
import { AvatarGroupComponent } from '@/modules/portal/tutor/components/AvatarGroupComponent';
import { SingleUserComponent } from '@/modules/portal/tutor/components/SingleUserComponent';
import ModalidadUbicacionCard from '@/modules/portal/tutor/components/ModalidadUbicacionCard';
import TruncatedJsonCell from '../../../core/components/TruncatedJsonCell';
import AuditLogsModal from '../../../core/components/AuditLogsModal';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const TableListAuditoria = ({ estado, items}) => {
  const statusColorMap = {
    UPDATE: "primary",
    DELETE: "danger",
    INSERT: "success",
  };
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure();

  const handleRowClick = (registro) => {
    console.log("Clicked");
    setSelectedRegistro(registro);
    setIsModalOpen(true);
  };

  return (
    <div className='mt-4'>
      <Table aria-label='Proximas citas'>
        <TableHeader>
            <TableColumn className='w-[15%] text-center'>Hora y Fecha</TableColumn>
            <TableColumn className='w-[10%] text-center'>Acción</TableColumn>
            <TableColumn className='w-[10%] text-center'>Nombre de la tabla</TableColumn>
            <TableColumn className='w-[25%] text-center max-w-[10rem]'>Antiguos valores</TableColumn>
            <TableColumn className='w-[25%] text-center max-w-[10rem]'>Nuevos Valores</TableColumn>
            <TableColumn className='w-[15%] text-center'>Registrado por</TableColumn>
            <TableColumn className='w-[15%] text-center'>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No hay citas proximas encontradas."} items={items}>
          {((registro) => (
            <TableRow key={registro.id} className='even:bg-gray-100'>
              <TableCell className='w-[10%] text-center'>
                  <div className='w-full'>
                    {registro.fechaHora}
                  </div>
              </TableCell>
              <TableCell className='w-[10%] text-center'>
              <Chip  className="capitalize" color={statusColorMap[registro.action]} size="sm" variant="flat">
                  {registro.action}
                </Chip>
                </TableCell>
              <TableCell className='w-[5%] text-left'>
                  <div>
                    {registro.tableName}
                  </div>
              </TableCell>
              <TableCell className='w-[10%] h-60 text-left max-w-[10rem] overflow-hidden'>
                <div className='h-full flex justify-center w-full items-center'>
                  <div className={`w-full break-words ${registro.oldValues ? 'text-left' : 'text-center'}`}>
                  {(() => {
                      const maxLength = 150;
                      const stringValue = registro.oldValues ? JSON.stringify(registro.oldValues) : '--';
                      if (stringValue.length <= maxLength) {
                        return stringValue;
                      }
                      return stringValue.slice(0, maxLength) + '...';
                    })()}
                  </div>
                </div>
              </TableCell>
              <TableCell className='w-[10%] h-60 text-left max-w-[10rem]'>
                <div className='h-full flex justify-center w-full items-center overflow-hidden'>
                  <div className={`w-full break-words ${registro.newValues ? 'text-left' : 'text-center'}`}>
                  {(() => {
                      const maxLength = 150;
                      const stringValue = JSON.stringify(registro.newValues);
                      if (stringValue.length <= maxLength) {
                        return stringValue;
                      }
                      return stringValue.slice(0, maxLength) + '...';
                    })()}
                  </div>
                </div>
              </TableCell>
              <TableCell className='w-[15%] text-center'>
                <div >
                  {registro.performedBy&&registro.performedBy.idAlumno!==null?
                    <SingleUserComponent student={registro.performedBy} />
                    :
                    <div>--</div>
                    }
                </div>
              </TableCell>
              <TableCell>
                <Button variant='light' color='default' onClick={() => handleRowClick(registro)}>
                  <Eye size={16}/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AuditLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        registro={selectedRegistro}
      />
    </div>
  );
};

export default TableListAuditoria;
