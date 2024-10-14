import { jwtDecode } from "jwt-decode";

export const fetchTypeAlumno = async (token) => {
    const decoded = jwtDecode(token);
    console.log(decoded.id)
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/listar-tipos-tutoria-alumno`, {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            "idAlumno": decoded.id
          })
        });
      if (!response.ok) {
        throw new Error('Error en el fetch')
      }
      const data = await response.json();
      data.data.unshift({id:0, nombreTutoria:'Todos'})
      return data.data
    } catch(error){
      throw new Error(error)
    }
  };