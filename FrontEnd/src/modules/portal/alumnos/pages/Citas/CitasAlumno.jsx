'use client'
import { Tab, Tabs } from '@nextui-org/react';
import { CalendarIcon, ListIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import ListadoCitas from '@/modules/portal/tutor/components/ListadoCitas';
import { useMode } from '@/modules/portal/tutor/states/CalendarModeContext';
import { useFile } from '@/modules/portal/coordinador/states/FileContext';
import ConfigurarCalendarioCitas from '../../components/ConfigurarCalendarioCitas';

const CitasAlumno = ({session}) => {
  const {viewMode, setMode} = useMode();
  const { saveFileData } = useFile();

  useEffect(() => {
    saveFileData(null)
  }, []);

  function handleChange(key) {
    console.log("CHANGE: ", key);
    if (key == "calendar")
      setMode("visualizarCitas");
  }
  return(
    <div className='flex flex-col'>
      <Tabs aria-label="Options" color="default" variant="bordered" defaultSelectedKey={viewMode} onSelectionChange={handleChange}>
        <Tab
          key="list"
          title={
            <div className="flex items-center space-x-2">
              <ListIcon size={20}/>
            </div>
          }
        >
          <ListadoCitas session={session} esAlumno={true}/>
        </Tab>
        <Tab
          key="calendar"
          title={
            <div className="flex items-center space-x-2">
              <CalendarIcon size={20}/>
            </div>
          }
        >    
          <ConfigurarCalendarioCitas session={session}/>
        </Tab>
      </Tabs>
    </div>
  );
};

export default CitasAlumno;