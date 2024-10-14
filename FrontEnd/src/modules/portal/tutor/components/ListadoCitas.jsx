import { Tab, Tabs } from '@nextui-org/react'
import React from 'react'
import ProximasCitas from './ProximasCitas'
import UltimosEventos from './UltimosEventos'
import CitasCanceladas from './CitasCanceladas'

const ListadoCitas = ({session, esAlumno = false}) => {
  return (
    <div className='flex flex-col w-full items-start'>
      <Tabs aria-label="Options" color="primary" variant="bordered">
        <Tab
          key="proximos-eventos"
          title={
            <span>Próximas citas</span>
          }
        >
          <ProximasCitas session={session} esAlumno={esAlumno}/>
        </Tab>
        <Tab
          key="ultimos-eventos"
          title={
            <span>Últimas citas</span>
          }
        >
          <UltimosEventos session={session} esAlumno={esAlumno}/>
        </Tab>
        <Tab
          key="citas-canceladas"
          title={
            <span>Citas canceladas</span>
          }
        >
          <CitasCanceladas session={session} esAlumno={esAlumno}/>
        </Tab>
      </Tabs>
    </div>
  )
}

export default ListadoCitas