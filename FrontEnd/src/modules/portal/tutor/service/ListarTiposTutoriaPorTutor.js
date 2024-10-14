import { jwtDecode } from "jwt-decode";

export const fetchTypeTutoriasTutorFijo = async (token) => {
  
  try{
      const decoded = jwtDecode(token)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/usuario/listarTiposTutoriaPorTutor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          "idTutor": decoded.id
        })
      });
      console.log(decoded.id)
      console.log(decoded.id)
      if (!response.ok) {
        throw new Error('Error en el fetch')
      }
      
      const data = await response.json();
      console.log(data)
      // Dependiendo de como te devuelva vas a hacer el unshift
      data.data.unshift({id:0, nombreTutoria:'Todos'})
      return data.data
    } catch(error){
      throw new Error(error)
    }
  };