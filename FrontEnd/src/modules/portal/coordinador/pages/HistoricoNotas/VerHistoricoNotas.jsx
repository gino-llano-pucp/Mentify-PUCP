import React from 'react';
import { useFile } from '../../states/FileContext';

export const VerHistoricoNotas = ({session}) => {
  const { fileData } = useFile();

  const bufferToBlob = (buffer, mime) => {
    const byteArray = new Uint8Array(buffer.data);
    return new Blob([byteArray], { type: mime });
  };

  const renderPdf = (pdfBuffer) => {
    const blob = bufferToBlob(pdfBuffer, 'application/pdf');
    const url = URL.createObjectURL(blob);
    return <iframe src={url} width="100%" height="600px" />;
  };

  return (
    <div>
      {fileData ? (
        <div>
          {renderPdf(fileData)}
        </div>
      ) : (
        <p>No hay datos de notas disponibles.</p>
      )}
    </div>
  );
};
