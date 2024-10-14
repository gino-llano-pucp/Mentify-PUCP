import React, { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button } from '@nextui-org/react';
import { Eye } from 'lucide-react';
import ErrorLogModal from './ErrorLogModal';
import { SingleUserComponent } from '../../tutor/components/SingleUserComponent';

const TableListErrorLogs = ({ items }) => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  return (
    <div className='mt-4'>
      <Table aria-label='Logs de errores'>
        <TableHeader>
          <TableColumn className='w-[15%] text-center'>Fecha y Hora</TableColumn>
          <TableColumn className='w-[10%] text-center'>Tipo de Error</TableColumn>
          <TableColumn className='w-[20%] text-center'>Mensaje de Error</TableColumn>
          <TableColumn className='w-[15%] text-center'>Endpoint</TableColumn>
          <TableColumn className='w-[10%] text-center'>Método</TableColumn>
          <TableColumn className='w-[15%] text-center'>Usuario</TableColumn>
          <TableColumn className='w-[15%] text-center'>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No se encontraron logs de errores."} items={items}>
          {(log) => (
            <TableRow key={log.id} className='even:bg-gray-100'>
              <TableCell className='text-center'>{log.timestamp}</TableCell>
              <TableCell className='text-center'>
                <Chip color={log.errorType === 'Error' ? 'danger' : log.errorType === 'TypeError' ? 'warning' : 'default'} size="sm" variant="flat">
                  {log.errorType}
                </Chip>
              </TableCell>
              <TableCell className='text-left'>
                <div className='truncate max-w-xs'>{log.errorMessage}</div>
              </TableCell>
              <TableCell className='text-center'>{log.endpoint}</TableCell>
              <TableCell className='text-center'>{log.method}</TableCell>
              <TableCell className='text-center'>
                {log.fid_usuario ?
                    <SingleUserComponent student={log.usuario} />
                     :
                    <div>--</div>
                }
                </TableCell>
              <TableCell className='flex items-center justify-center'>
                <Button variant='light' color='default' onClick={() => handleRowClick(log)}>
                  <Eye size={16}/>
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ErrorLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        log={selectedLog}
      />
    </div>
  );
};

export default TableListErrorLogs;