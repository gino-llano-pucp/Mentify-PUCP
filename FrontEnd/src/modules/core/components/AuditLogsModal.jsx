"use client"
import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@nextui-org/react";
import Image from 'next/image';
import { SingleUserComponent } from '@/modules/portal/tutor/components/SingleUserComponent';
import Separator from '@/modules/auth/components/Separator';

const convertToPeruTime = (utcDateString) => {
    const date = new Date(utcDateString);
    const peruTime = new Date(date.getTime() - 5 * 60 * 60 * 1000); // GMT-5
    return peruTime.toLocaleString('es-PE', { 
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

const ImageRenderer = ({ data }) => {
    const [imageUrl, setImageUrl] = useState('');
  
    useEffect(() => {
      const blob = new Blob([new Uint8Array(data)], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }, [data]);
  
    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    return (
      <div>
        {imageUrl && (
          <Image 
            src={imageUrl} 
            className='rounded-full'
            alt="Image from log" 
            width={100} 
            height={100} 
            style={{ objectFit: 'cover' }} 
          />
        )}
        <br />
        <Button color='primary' onClick={handleDownload} size="sm">Descargar imagen</Button>
      </div>
    );
  };

const NestedTableCell = ({ value }) => {
    const renderValue = (val) => {

        if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
            return convertToPeruTime(val);
          }

        if (typeof val === 'object' && val !== null && 'data' in val && Array.isArray(val.data)) {
            // This is likely an image
            return <ImageRenderer data={val.data} />;
          }

      if (typeof val !== 'object' || val === null) {
        return <span className='w-full overflow-hidden text-ellipsis'>{JSON.stringify(val)}</span>;
      }
  
      return (
        <Table aria-label="Nested table" className="w-full">
          <TableHeader>
            <TableColumn>Key</TableColumn>
            <TableColumn>Value</TableColumn>
          </TableHeader>
          <TableBody>
            {Object.entries(val).map(([key, nestedVal]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  {renderValue(nestedVal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    };
  
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value);
        return renderValue(parsedValue);
      } catch (e) {
        // If parsing fails, treat it as a string
        return <span className='w-full'>{value}</span>;
      }
    }
  
    return renderValue(value);
  };

const AuditLogsModal = ({ isOpen, onClose, registro }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      if (isOpen) {
        setIsVisible(true);
      } else {
        setTimeout(() => setIsVisible(false), 300);
      }
    }, [isOpen]);
  
    if (!isVisible || !registro) return null;

    const changes = Object.keys({...registro.oldValues, ...registro.newValues}).map(key => ({
        attribute: key,
        previousValue: registro.oldValues?.[key],
        newValue: registro.newValues?.[key]
    }));

    const statusColorMap = {
        UPDATE: "primary",
        DELETE: "danger",
        INSERT: "success",
      };
  
      return (
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          scrollBehavior="inside"
          size="4xl"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Registros de auditoría</ModalHeader>
            <ModalBody>
              <div className="space-y-2 mb-4 w-1/2 ">
                <div className="grid grid-cols-2">
                  <span className="text-gray-600 text-sm">Tiempo</span>
                  <span className='text-sm'>{registro.fechaHora}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600 text-sm">Nombre de la tabla</span>
                  <span className='text-sm'>{registro.tableName}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600 text-sm">Acción</span>
                  <Chip className="capitalize" color={statusColorMap[registro.action]} size="sm" variant="flat">
                    {registro.action}
                  </Chip>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-gray-600 text-sm">Realizado por</span>
                  <span>
                    {registro.performedBy && registro.performedBy.idAlumno !== null 
                    ? <SingleUserComponent student={registro.performedBy} />
                    : '--'}
                </span>
                </div>
              </div>
              <Separator/>
              <div>
                <h3 className="font-semibold mb-2">Cambios</h3>
                <Table 
                aria-label="Changes table"
                classNames={{
                    base: "max-h-[300px] overflow-scroll",
                    table: "min-w-full",
                }}
                >
                <TableHeader>
                    <TableColumn>Atributo</TableColumn>
                    <TableColumn>Valor anterior</TableColumn>
                    <TableColumn>Nuevo valor</TableColumn>
                </TableHeader>
                <TableBody items={changes}>
                    {(item) => (
                    <TableRow key={item.attribute}>
                        <TableCell>{item.attribute}</TableCell>
                        <TableCell className='max-w-[20rem] overflow-hidden text-ellipsis'>
                            {/* <span className='w-4 overflow-hidden text-ellipsis'>{item.previousValue !== undefined ? JSON.stringify(item.previousValue) : '--'}</span> */}
                            <NestedTableCell value={item.previousValue !== undefined ? item.previousValue : '--'} />
                        </TableCell>
                        <TableCell className='max-w-[20rem] overflow-hidden text-ellipsis'>
                            <NestedTableCell value={item.newValue !== undefined ? item.newValue : '--'} />
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
  };

export default AuditLogsModal