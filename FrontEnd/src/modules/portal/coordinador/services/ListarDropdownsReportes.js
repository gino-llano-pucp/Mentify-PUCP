import { jwtDecode } from "jwt-decode";
import { filter } from "lodash";

export const fetchTipoTutoriasFacultadPrograma = async (session, programs, filterFacultadPrograma) => {
  console.log(programs)
  console.log(programs?.length)
  console.log(jwtDecode(session.accessToken).id,)
  //Para el parametro filtroFacultadPrograma se considera como 0 al listado de los tipos de tutoria
  //de la facultad y programa, 1 para solo listar los de facultad y 2 para listar solo los de programa
  if(programs===undefined)
    return
  try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/listar-tipos-tutoria-reporte`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          "idCoordinador": jwtDecode(session.accessToken).id,
          "idPrograma": programs.length === undefined ? programs.id : programs,
          "filtroFacultadPrograma": filterFacultadPrograma.uid,
        })
      });

      if (!response.ok) {
        throw new Error('Error en el fetch')
      }
      const data = await response.json();
      console.log(jwtDecode(session.accessToken).id)
      console.log(filterFacultadPrograma)
      console.log(programs)
      console.log(data)

      data.unshift({id:0, nombreTutoria:'Todos'})
      return data
    } catch(error){
      throw new Error(error)
    }
  };

export const fetchProgramasFacultad = async (session) => {
  console.log("over here")
  try{

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/programa/listar-programas-usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({
          idUsuario: jwtDecode(session.accessToken).id
        })
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Error en el fetch')
      }
      const data = await response.json();
      console.log(data)
      data.unshift({id:0, nombrePrograma:'Todos'})
      
      return data
    } catch(error){
      throw new Error(error)
    }
  };
