import toast from 'react-hot-toast';

const fetchAPI = async ({
  endpoint,
  method = 'GET',
  payload = null,
  token,
  successMessage,
  errorMessage,
  showToast = true,
  useCache = true
}) => {
  console.log(payload)
  console.log(endpoint)
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: method !== 'GET' && payload ? JSON.stringify(payload) : null,
      cache: useCache ? 'default' : 'no-store'
    });

    const data = await response.json();

    if (!response.ok) {
      // El mensaje de error siempre se encuentra en `data.error.message`
      if (showToast) {
        toast.error(`${errorMessage}: ${data.error.message || 'Ocurrió un error desconocido'}`);
      } else {
        console.log(`${errorMessage}: ${data.error.message || 'Ocurrió un error desconocido'}`);
      }
      return null;
    }

    // `data.message` es donde se guarda el mensaje de éxito
    if (showToast) {
      toast.success(`${successMessage}: ${data.message}`);
    } else {
      console.log(`${successMessage}: ${data.message}`);
    }

    return data; // Retornar los datos para uso posterior si es necesario
  } catch (error) {
    console.error('Error en la llamada API:', error);
    // Proporcionar un mensaje predeterminado si `error.message` no está disponible
    if (showToast) {
      toast.error(`${errorMessage}: ${error.message || 'Error de conexión'}`);
    }
    return null;
  }
};

export default fetchAPI;
