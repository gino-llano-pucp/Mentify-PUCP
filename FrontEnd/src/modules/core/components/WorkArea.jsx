'use client';
import React, { useEffect } from 'react';
import { useActiveComponent } from '../states/ActiveComponentContext';
import { FacultadCoordinadorProvider } from '@/modules/portal/admin/states/FacultadCoordinadorContext';
import { UsersProvider } from '../states/UsersContext';
import { FacultadProvider } from '@/modules/portal/admin/states/FacultadContext';
import { TutoringTypeProvider } from '@/modules/portal/coordinador/states/TutoringTypeContext';
import { MisTutoresProvider } from '../states/MisTutores';
import { TipoTutoriaSolicitudProvider } from '@/modules/portal/alumnos/states/TipoTutoriaSolicitudContext';
import { TutorProvider } from '@/modules/portal/coordinador/states/TutorContext';
import { DerivacionProvider } from '@/modules/portal/tutor/states/DerivacionContext';
import { NameTutoringTypeProvider } from '../states/TutoringTypeContext';
import { StudentInfoProvider } from '@/modules/portal/tutor/states/StudentInfoContext';
import { DetalleAlumnoProvider } from '@/modules/portal/tutor/states/DetalleAlumnoContext';
import { EventProvider } from '@/modules/portal/tutor/states/EventContext';
import { ModeProvider } from '@/modules/portal/tutor/states/CalendarModeContext';
import { FileProvider } from '@/modules/portal/coordinador/states/FileContext';
import { ProgramaProvider } from '@/modules/portal/admin/states/ProgramaContext';
import { EncuestaProvider } from '@/modules/portal/alumnos/states/EncuestaContext';
import { SolicitudDerivacionProvider } from '@/modules/portal/responsableTutoria/states/SolicitudDerivacionContext';
import { UnidadProvider } from '@/modules/portal/admin/states/UnidadContext';
import fetchAPI from '../services/apiService';
import { useInstitucion } from '../states/InstitutionContext';

const WorkArea = ({session}) => {
  // Obtener componente a renderizar
  const { navigationHistory } = useActiveComponent();
  const ActiveComponent =
    navigationHistory.length > 0 ? navigationHistory[navigationHistory.length - 1].component : null;
  const { setInstitucion } = useInstitucion();

  console.log("session 1j2k312: ", session);
  
  // Efecto para imprimir en consola cuando activeComponent cambie
  useEffect(() => {
    console.log('Active component has changed:', ActiveComponent);
  }, [ActiveComponent]); // Dependencias del efecto, reacciona solo a cambios en activeComponent

  // Cargar datos de institucion
  useEffect(() => {
    const fetchInstitucionData = async () => {
      if (!session || !session.accessToken) {
        console.log('No session or token available');
        return;
      }

      try {
        const data = await fetchAPI({
          endpoint: '/institucion/',
          method: 'GET',
          token: session.accessToken,
          successMessage: 'Datos de la institución cargados correctamente',
          errorMessage: 'Error al cargar los datos de la institución',
          showToast: false
        });

        if (data) {
          setInstitucion(data);
        }
      } catch (error) {
        console.error('Error al cargar los datos de la institución:', error);
      }
    };

    fetchInstitucionData();
  }, []);

  const SkeletonLoader = () => (
    <div className='flex animate-pulse'>
      <div className='w-[150px] h-6 bg-gray-300 rounded'>&nbsp;&nbsp;&nbsp;</div>
    </div>
  );

  return (
    <SolicitudDerivacionProvider>
      <EncuestaProvider>
        <EventProvider>
          <DetalleAlumnoProvider>
            <DerivacionProvider>
              <NameTutoringTypeProvider>
                <TutorProvider>
                  <TipoTutoriaSolicitudProvider>
                    <MisTutoresProvider>
                      <FacultadProvider>
                        <UsersProvider>
                          <FacultadCoordinadorProvider>
                            <StudentInfoProvider>
                              <TutoringTypeProvider>
                                <ModeProvider>
                                  <FileProvider>
                                    <ProgramaProvider>
                                      <UnidadProvider>
                                        <div className='h-full px-4 py-2 overflow-y-auto md:px-12'>
                                            {/* Renderizar ActiveComponent si existe, y pasarle el prop session */}
                                            {ActiveComponent ? <ActiveComponent session={session} /> : <SkeletonLoader />}
                                        </div>
                                      </UnidadProvider>
                                  </ProgramaProvider>
                                  </FileProvider>
                                </ModeProvider>
                              </TutoringTypeProvider>
                            </StudentInfoProvider>
                          </FacultadCoordinadorProvider>
                        </UsersProvider>
                      </FacultadProvider>
                    </MisTutoresProvider>
                  </TipoTutoriaSolicitudProvider>
                </TutorProvider>
              </NameTutoringTypeProvider>
            </DerivacionProvider>
          </DetalleAlumnoProvider>
        </EventProvider>
      </EncuestaProvider>
    </SolicitudDerivacionProvider>
  );
};

export default WorkArea;
