'use client';
import SearchInput from '@/modules/core/components/SearchInput';
import fetchAPI from '@/modules/core/services/apiService';
import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { CircleCheckBig, CircleX } from 'lucide-react';
import UseButton from '@/modules/core/components/UseButton';
import ListaAProcesarUnidadesAcademicas from './ListaAProcesarUnidadesAcademicas';
import { useUnidades } from '../states/UnidadContext';
import toast from 'react-hot-toast';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';
import { componentMapping } from '@/modules/core/lib/componentMapping';


function ListadoCargaUnidadesAcademicas({session}){
    const [currentPage, setCurrentPage] = useState(1);
    const [filtro, setFiltro] = useState('');
    const [statusFilter, setStatusFilter] = useState(new Set(["Activo"]));
    const { setActiveComponentById } = useActiveComponent();
    const { unidades } = useUnidades();
    const [flag, setFlag] = useState(true);
    const itemsPerPage = 9;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const [endIndex, setEndIndex] = useState(startIndex + itemsPerPage);


    const handleSearchChange = (e) => {
        if(e.target.value.length === 0){
          setEndIndex(9);
        }
        setCurrentPage(1);
        setFiltro(e.target.value);
    };

    

    const filteredUnidadesAcademicas = unidades[0].filter((unidad) => { //unidades[0]?
        const filtroLower = filtro.toLowerCase();
        const siglaLower = unidad.siglas.toLowerCase();
        const correoDeContactoLower = unidad.correoDeContacto.toLowerCase();
        const nombreLower = unidad.nombre.toLowerCase();
        const currentStatusFilter = [...statusFilter];
        return (
          (siglaLower.includes(filtroLower) ||
          correoDeContactoLower.includes(filtroLower) ||
          nombreLower.includes(filtroLower)) &&
          (currentStatusFilter.length === 3 || currentStatusFilter.includes(unidad.esActivo ? 'Activo' : 'Inactivo'))
        );
    });

    const unidadesToShow = filteredUnidadesAcademicas.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUnidadesAcademicas.length / itemsPerPage);

    const handleClick = async () => {
        toast.promise(
           cargaMasiva(),
          {
            loading: 'Cargando Unidades Académicas...',
            success: 'Unidades Académicas procesadas con éxito',
            error: 'Error al procesar Unidades Académicas'
          },
          {
            style: {
              minWidth: '250px'
            }
          }
        )
        .catch((error) => {
          console.error('Failed to post render request: ', error);
        });
      };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const newStartIndex = (page - 1) * itemsPerPage;
        const newEndIndex = Math.min(newStartIndex + itemsPerPage, filteredUnidadesAcademicas.length);
        setEndIndex(newEndIndex);
        };

    useEffect(() => {
        console.log('Unidades Academicas: ', unidades);
      }, [unidades]);

    //====Limpiar Search======== 
    const clearSearch = () => {
        setEndIndex(9)
        setFiltro('');
    };
    //==========================

    const cargaMasiva = async () => {
        console.log("Se va a cargar: ",unidades);
        const cleanedUnidades = unidades[0].map(({ esActivo, id_unidad_academica, ...rest }) => rest);
        console.log("Se va a cargar limpiando: ",cleanedUnidades);
        try {
            const token = session?.accessToken;
            console.log('sess: ', session);
            if (!token) {
              setFlag(false)
              throw new Error('Token invalido')
            }

            const response = await fetchAPI({
              endpoint: '/unidadAcademica/carga-masiva-unidades-academicas',
              method: 'POST',
              payload: cleanedUnidades,
              token: token,
              successMessage: 'Unidades Académicas cargadas con éxito',
              errorMessage: 'Error al cargar las Unidades Académicas',
              showToast: false,
            });

            setActiveComponentById('unidadesAcademicas',`Gestión de Unidades Académicas`,true);

          } catch (error) {
            //console.error('Error al cargar las Unidades Académicas', error);
            setFlag(false)
            throw error;
            //return error
          }
    };

    return(
        <div className='flex flex-col w-full h-full gap-6'>
            <div className='flex flex-row items-end justify-between w-full'>
                <div className='flex flex-row items-end w-full gap-2'>
                    <div className='flex flex-col w-3/5 gap-1'>
                        <span className='text-lg font-semibold'>Nombres, siglas o correo de la Unidad Académica</span>
                        <SearchInput 
                        placeholder={'Ingresa el nombre, siglas o correo de la Unidad Académica'}
                        value={filtro}
                        onChange={handleSearchChange}
                        clearSearch={clearSearch}
                        />
                    </div>
                    <Button
                        color='primary'
                        variant='shadow'
                        className='flex items-center justify-center w-40'
                        startContent={<CircleCheckBig size={20} />}
                        onClick={()=>{
                            if (!flag) return;
                            setFlag(false);
                            cargaMasiva()}}
                    >
                        Procesar
                    </Button>
                    <UseButton
                        color='danger'
                        variant='shadow'
                        className='flex items-center justify-center w-40'
                        startContent={<CircleX size={20} />}
                        text='Cancelar'
                        componentId={"unidadesAcademicas"} //Malogra el Breadcrum .-.
                        componentName={'Gestión de Unidades Académicas'}
                    />
                </div>
            </div>
            <ListaAProcesarUnidadesAcademicas filteredUnidadesAcademicas={unidadesToShow} handlePageChange={handlePageChange} page={currentPage} totalPages={totalPages} update={setCurrentPage}/>
        </div>
    );
}

export default ListadoCargaUnidadesAcademicas;