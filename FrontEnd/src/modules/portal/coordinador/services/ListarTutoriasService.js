export const fetchTypeCoordinador = async (token) => {
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/tipoTutoria/tiposTutoria`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Error en el fetch')
    }
    const data = await response.json();
    console.log(data)
    data.unshift({id:0, nombreTutoria:'Todos'})
    return data
  } catch(error){
    throw new Error(error)
  }
};