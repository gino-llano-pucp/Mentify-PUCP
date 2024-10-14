'use client'
import { Tab, Tabs } from '@nextui-org/react';
import { CalendarIcon, ListIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import CalendarioTutor from '../components/CalendarioTutor';
import ListadoCitas from '../components/ListadoCitas';
import { useMode } from '../states/CalendarModeContext';
import { useFile } from '../../coordinador/states/FileContext';

const CitasTutor = ({session}) => {
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

  return (
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
          <ListadoCitas session={session}/>
        </Tab>
        <Tab
          key="calendar"
          title={
            <div className="flex items-center space-x-2">
              <CalendarIcon size={20}/>
            </div>
          }
        >
          <CalendarioTutor session={session}/>
        </Tab>
      </Tabs>
    </div>
  );

}

export default CitasTutor;