import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import SearchInput from '@/modules/core/components/SearchInput';
import { Button, CircularProgress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination } from '@nextui-org/react';
import DerivacionCard from '../components/DerivacionCard';
import { ChevronDownIcon } from 'lucide-react';

export const SolicitudesDerivacion = ({session}) => {
    const [filtro, setFiltro] = useState('');
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const [endIndex, setEndIndex] = useState(startIndex + itemsPerPage);
    const decoded = jwtDecode(session.accessToken)
    const [statusFilter, setStatusFilter] = useState(new Set(["Todos"]));
    const [derivaciones, setDerivaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusDerivacionFiltros = [
        { nombre: "Todos" },
        { nombre: "Pendiente" },
        { nombre: "Enviado" }
    ];

    const [selectedValue, setSelectedValue] = useState('Todos');

    const handleSelectionChange = (keys) => {
        const selectedKey = [...keys][0];
        setStatusFilter(new Set([selectedKey]));
        setSelectedValue(statusDerivacionFiltros.find(status => status.nombre === selectedKey).nombre);
    };

    const handleSearchChange = (e) => {
        if(e.target.value.length === 0){
          setEndIndex(9);
        }
        setCurrentPage(1);
        setFiltro(e.target.value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const newStartIndex = (page - 1) * itemsPerPage;
        const newEndIndex = Math.min(newStartIndex + itemsPerPage, filteredUsers.length);
        setEndIndex(newEndIndex);
    };

    useEffect(() => {
        if (session && session.accessToken) {
            fetchDerivaciones();
        }
    }, []);

    const fetchDerivaciones = async () => {
        if (!session || !session.accessToken) {
            console.log('No session or token available');
            return;
        }

        console.log(decoded.id)

        const token = session?.accessToken;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/listar-derivaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                idResponsable: decoded.id
            })
        });

        const data = await response.json();

        console.log(data);

        if (data && data.data && Object.keys(data.data).length > 0) {
            setDerivaciones(data.data.derivaciones);
        } else {
            console.log('No hay derivaciones');
            setDerivaciones([]);
        }
        setLoading(false);
    }

    const filteredUsers = derivaciones.filter((user) => {
        const filtroLower = filtro.toLowerCase();
        const nombresLower = user.Tutor.nombres.toLowerCase();
        const apellidoLower = user.Tutor.primerApellido.toLowerCase();

        console.log(user.estado);
        console.log(statusFilter);

        const estado = [...statusFilter][0];

        const cruzarNombre = nombresLower.includes(filtroLower) ||
        apellidoLower.includes(filtroLower) ||
        nombresLower.concat(' ', apellidoLower).includes(filtroLower)

        const cruzarEstado = estado === "Todos" || user.estado === estado;

        return (
          // ! Alexito, creas lo de los estados y lo colocas aqui para que lo filtre.
          cruzarNombre && cruzarEstado
        );
    });

    useEffect(() => {
        // ~ Esto es para que cuando se cambie el filtro de estado, se resetee la pagina a la 1
        setCurrentPage(1);
    }, [statusFilter]);

    const usersToShow = filteredUsers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const clear = () => {
        setEndIndex(9)
        setFiltro('');
    };

    return (
        <div className='flex flex-col w-full h-full gap-6'>
            <div className='flex flex-row items-end justify-between w-full'>
                <div className='flex flex-row items-end w-full gap-2'>
                    <div className='flex flex-col w-3/5 gap-1'>
                        <span className='text-lg font-semibold'>Nombre o Apellido del Tutor</span>
                        <SearchInput
                            placeholder={`Ingresa el nombre o apellido del tutor`}
                            value={filtro}
                            onChange={handleSearchChange}
                            clearSearch={clear}
                        />
                    </div>
                    {/* Alexito, aqui iria tu dropdown de los estados de la derivacion */}

                    <div className='flex flex-col w-48 gap-1'>
                        <span className='text-lg font-semibold'>Estado de Derivación</span>
                        <Dropdown className='min-w-44'>
                            <DropdownTrigger>
                                <Button
                                endContent={<ChevronDownIcon size={16} />}
                                variant='flat'
                                className='flex justify-between text-gray-700 min-w-44 w-full'
                                >
                                {selectedValue}
                                </Button>
                            </DropdownTrigger>

                            <DropdownMenu
                                aria-label='Estado de derivación'
                                variant='flat'
                                className='box-border w-44 min-w-44'
                                disallowEmptySelection
                                selectionMode='single'
                                selectedKeys={statusFilter}
                                onSelectionChange={handleSelectionChange}
                            >
                                {statusDerivacionFiltros.map((status) => (
                                <DropdownItem key={status.nombre}>{status.nombre}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap w-full gap-[12px]'>
                {loading ? (
                        <div className='flex flex-row items-center gap-3'>
                            <CircularProgress aria-label='Loading...' />
                            <div>Cargando Derivaciones...</div>
                        </div>
                    ) : usersToShow.length > 0 ? (
                        usersToShow.map((user) => (
                            <DerivacionCard
                                users={user}
                                key={user.id_derivacion}
                                //update={update}
                            />
                    ))
                    ) : (
                    <div>No se encontraron derivaciones.</div>
                )}
            </div>
            <div className='flex items-center justify-center w-full px-2 py-2 mt-auto'>
                <Pagination
                    isCompact
                    loop
                    showControls
                    showShadow
                    size='md'
                    color='primary'
                    initialPage={1}
                    className={usersToShow.length === 0 ? 'hidden' : ''}
                    total={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    )
}