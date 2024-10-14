# Usa una imagen base de Node.js
FROM node:alpine

# Crea y establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración del backend y frontend
COPY ./BackEnd/package.json ./BackEnd/package-lock.json ./BackEnd/
COPY ./FrontEnd/package.json ./FrontEnd/package-lock.json ./FrontEnd/

# Instala las dependencias del backend
RUN cd ./BackEnd && npm install

# Instala las dependencias del frontend
RUN cd ./FrontEnd && npm install

# Instala `concurrently` globalmente para correr múltiples servicios
RUN npm install -g concurrently

# Copia el código del backend y frontend
COPY ./BackEnd ./BackEnd
COPY ./FrontEnd ./FrontEnd

# Exponer los puertos
EXPOSE 3000 5000

# Configura las variables de entorno
ENV NODE_ENV=development

# Comando para iniciar ambos servicios
CMD concurrently "cd ./BackEnd && npm run dev" "cd ./FrontEnd && npm run dev"
