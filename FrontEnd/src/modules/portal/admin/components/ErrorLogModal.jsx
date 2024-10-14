import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Chip } from "@nextui-org/react";
import { SingleUserComponent } from '../../tutor/components/SingleUserComponent';
import ErrorTableAttribute from './ErrorTableAttribute';

const ErrorLogModal = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  const statusColorMap = {
    Error: "danger",
    TypeError: "warning",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Detalles del Log de Error</ModalHeader>
        <ModalBody>
            <div className="space-y-2 mb-4 w-full">
                <ErrorTableAttribute
                    title={'Tiempo'}
                    body={log.timestamp}
                />
                <ErrorTableAttribute
                    title={'Tipo'}
                    body={<Chip className="capitalize" color={statusColorMap[log.errorType]} size="sm" variant="flat">
                            {log.errorType}
                            </Chip>}
                />
                <ErrorTableAttribute
                    title={'Mensaje'}
                    body={log.errorMessage}
                />
                <ErrorTableAttribute
                    title={'Endpoint'}
                    body={log.endpoint}
                />
                <ErrorTableAttribute
                    title={'Realizado por'}
                    body={log.fid_usuario 
                        ? <SingleUserComponent student={log.usuario} />
                        : '--'
                    }
                />
                <ErrorTableAttribute
                    title={'Stack trace'}
                    body={<pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto w-[520px] h-40">
                            <span className='w-full'>{log.stackTrace}</span>
                      </pre>
                    }
                />
                <ErrorTableAttribute
                    title={'Parámetros'}
                    body={<pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto w-full h-48">
                        {JSON.stringify(log.params, null, 2)}
                      </pre>
                    }
                />
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

export default ErrorLogModal;