import { jwtDecode } from "jwt-decode";

export const fetchTypeTutoriasTutorFijo = async (token) => {
    
    try{
      const decoded = jwtDecode(token)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/listar-tipos-tutoria-coordinador`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "idCoord": decoded.id
        })
      });
      if (!response.ok) {
        console.log(decoded.id)
        throw new Error('Error en el fetch')
      }
      const data = await response.json();
      console.log(data)
      data.data.unshift({id:0, nombreTutoria:'Todos'})
      return data.data
    } catch(error){
      throw new Error(error)
    }
  };