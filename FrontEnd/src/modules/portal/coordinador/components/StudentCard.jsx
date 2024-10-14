import { Hash, Mail, Book } from 'lucide-react';
import CardAttribute from '@/modules/portal/admin/components/CardAttribute';
import { useDetalleAlumno } from '../../tutor/states/DetalleAlumnoContext';
import { useActiveComponent } from '@/modules/core/states/ActiveComponentContext';


export const StudentCard = ({student, requestDetails}) => {
  console.log(student)
  const { setActiveComponentById } = useActiveComponent();
  const {addDetalleAlumno } = useDetalleAlumno();
  const classNamePersonalized = `w-[350px] flex flex-col gap-4 p-4 border rounded-xl `+(requestDetails?"hover:cursor-pointer transition-shadow hover:shadow-lg":"")

  

  const funcionAgregarContextoAccederDetalle = () =>{
    if(requestDetails){
    addDetalleAlumno(student);
    setActiveComponentById('detalleAlumnoAsignado', 'Detalle de Alumno Asignado');
  }
}

  return (
    <div className={classNamePersonalized} onClick={funcionAgregarContextoAccederDetalle}>
      <div className='flex flex-row items-center justify-between w-full gap-6 card-header'>
        <h3 className='w-[255px] text-lg font-semibold break-words'>
          {student.nombres?(student.nombres+' '+(student.primerApellido?student.primerApellido:' ')):student.nombreAlumno + ' ' + student.primerApellido}
        </h3>
      </div>
      <div className='flex flex-col w-full gap-2'>
        <CardAttribute 
          icon={<Hash size={20} />} 
          text={student.codigo?student.codigo:student.codigoAlumno} />
        {student.nombrePrograma === null &&student.nombreFacultad===null ? null :
        <CardAttribute
          icon={<Book size={20} />}
          text={student.nombrePrograma?`Programa: ${student.nombrePrograma}`:(student.nombreFacultad?`Facultad: ${student.nombreFacultad}`:'')}
        />}
        <CardAttribute 
          icon={<Mail size={20} />} 
          text={student.email?student.email:student.correo} />
      </div>
    </div>
  )
}
