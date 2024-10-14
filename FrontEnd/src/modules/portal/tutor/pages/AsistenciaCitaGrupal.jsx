'use client';
import SearchInput from '@/modules/core/components/SearchInput';
import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react'
import { Hash, Mail, Info, Book } from 'lucide-react';
import CardAttribute from '../../admin/components/CardAttribute';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import {Checkbox} from "@nextui-org/react";
import { CirclePlus } from 'lucide-react';
import { useEventInfo } from '../states/EventContext';

const AsistenciaCitaGrupal = ({session}) => {
  const {event, asistenciaContext, setAsistenciaContext} = useEventInfo();
  const {alumnos} = event;

  const [filtro, setFiltro] = useState('');
  const [students, setStudents] = useState(alumnos);

  const { setActiveComponentById } = useActiveComponent();

  const [checks, setChecks] = useState([]);
  const [seleccionarTodos, setSeleccionarTodos] = useState(false);
  
  useEffect(() => {
    console.log(asistenciaContext);
    console.log(students);
    const newChecks = students.map((alumno, index) => {
      return {
        id: alumno.email,
        checked: (asistenciaContext[index] ? asistenciaContext[index] : false),
      }
    });
    console.log(newChecks);
    setChecks(newChecks);
  }, [asistenciaContext])

  const filterStudents = (value) => {
    return alumnos.filter((alumno) => alumno.nombres.toLowerCase().includes(value.toLowerCase()) || 
    alumno.primerApellido.toLowerCase().includes(value.toLowerCase()) ||
    alumno.segundoApellido.toLowerCase().includes(value.toLowerCase()) ||
    alumno.email.toLowerCase().includes(value.toLowerCase()))
  }

  const handleSearchChange = (e) => {
    setFiltro(e.target.value);
    setStudents(filterStudents(e.target.value));
  };

  const clearSearch = () => {
    setFiltro('');
    setStudents(alumnos);
  };

  const handleToggleSelectAll = (checked) => {
    setChecks(checks.map((item) => {
      return {
        id: item.id,
        checked: checked
      }
    }));
    setSeleccionarTodos(checked);
  };

  const handleToggleStudent = (student, index) => {
    console.log(student);
    console.log(index);
    for (let i=0; i<checks.length; i++) {
      if (checks[i].id == student.email) {
        checks[i].checked = !(checks[i].checked)
        break;
      }
    }
    console.log(checks);
    setChecks(JSON.parse(JSON.stringify(checks)));
  };


  const guardarAsistencia = () => {
    console.log(checks);
    setAsistenciaContext(checks.map((check) => check.checked));
    setActiveComponentById('resultadosDeCita', `Detalle`);
  };

  return (
    <div className='flex flex-col w-full h-full gap-6 '>
      <div className='flex flex-row items-end justify-between w-full'>
        <div className='flex flex-row items-center justify-between w-full gap-2'>
          <div className='flex flex-col w-3/5 gap-1'>
            <span className='text-lg font-semibold'>Nombre o correo del alumno</span>
            <SearchInput
              placeholder='Ingresa el nombre o correo del alumno'
              value={filtro}
              onChange={handleSearchChange}
              clearSearch={clearSearch}
            />
          </div>
          <Checkbox 
            isSelected={seleccionarTodos}
            color="primary"
            onChange={(e) => handleToggleSelectAll(e.target.checked)}
          >
            Seleccionar todos
          </Checkbox>
          <Button
            color='primary'
            variant='shadow'
            className='flex items-center justify-center'
            onPress={guardarAsistencia}
          >
            Guardar
          </Button>
        </div>
      </div>

      <div className='flex flex-col h-[85%]'>
      <div className='flex flex-wrap w-full gap-4 overflow-y-auto'>
        { students.length > 0 ? (
          students.map((student, index) => (
            <div
              key={index}
              className='w-[360px] flex flex-col gap-4 p-4 border rounded-xl hover:cursor-pointer'
            >
              <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
                <h3 className='w-[255px] text-lg font-semibold break-words'>
                  {student.nombres + ' ' + student.primerApellido}
                </h3>          
              <Checkbox
                isSelected={checks.length > 0 && checks.find((item) => item.id == student.email).checked}
                onChange={() => handleToggleStudent(student, index)}
                color="primary"
              />
              </div>
              <div className='flex flex-col w-full gap-2'>
{/*                 <CardAttribute icon={<Hash size={20} />} text={student.codigo} /> */}
                <CardAttribute icon={<Mail size={20} />} text={student.email} />
              </div>
            </div>
            
          ))
        ) : (
          <div>No se encontraron alumnos que coincidan con la búsqueda.</div>
        )}
        </div>

      </div>

    </div>
  );
};

export default AsistenciaCitaGrupal;
