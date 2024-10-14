-- Eliminacion base de datos
-- Desactivar las comprobaciones de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Generar el script de truncado para luego ejecutar
SELECT CONCAT('TRUNCATE TABLE `', table_schema, '`.`', table_name, '`;')
FROM information_schema.tables
WHERE table_schema = 'Mentify' AND table_type = 'BASE TABLE';

-- Activar las comprobaciones de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;
