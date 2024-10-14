const moment = require('moment');
const { Op, Sequelize } = require('sequelize');
const db = require('../models');
const ErrorLog = db.ErrorLog;
const Usuario = db.Usuario;

const ErrorLogService = {
    async listarPorPaginacion({ 
        page = 1, 
        pageSize = 25, 
        fechaDesde, 
        fechaHasta, 
        userSearch, 
        errorTypeSearch, 
        sortBy = 'timestamp', 
        sortOrder = 'DESC' 
    }) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;

        let whereClause = {};

        if (fechaDesde || fechaHasta) {
            whereClause.timestamp = {};
            if (fechaDesde) {
                whereClause.timestamp[Op.gte] = moment(fechaDesde, 'YYYY-MM-DD').startOf('day').toDate();
            }
            if (fechaHasta) {
                whereClause.timestamp[Op.lte] = moment(fechaHasta, 'YYYY-MM-DD').endOf('day').toDate();
            }
        }

        if (errorTypeSearch) {
            whereClause.errorType = Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('errorType')),
                'LIKE',
                `%${errorTypeSearch.toLowerCase()}%`
            );
        }

        const includeClause = {
            model: Usuario,
            as: 'Usuario',
            attributes: ['id_usuario', 'nombres', 'primerApellido', 'imagen', 'email'],
        };

        if (userSearch) {
            includeClause.where = {
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('Usuario.nombres')),
                        'LIKE',
                        `%${userSearch.toLowerCase()}%`
                    ),
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('Usuario.primerApellido')),
                        'LIKE',
                        `%${userSearch.toLowerCase()}%`
                    ),
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('Usuario.segundoApellido')),
                        'LIKE',
                        `%${userSearch.toLowerCase()}%`
                    ),
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('Usuario.email')),
                        'LIKE',
                        `%${userSearch.toLowerCase()}%`
                    )
                ]
            };
        }

        const { count, rows } = await ErrorLog.findAndCountAll({
            where: whereClause,
            include: [includeClause],
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder]]
        });

        const totalPages = Math.ceil(count / limit);
        const errorLogs = rows.map(log => ({
            id: log.id,
            fid_usuario: log.fid_usuario,
            errorType: log.errorType,
            errorMessage: log.errorMessage,
            stackTrace: log.stackTrace,
            endpoint: log.endpoint,
            method: log.method,
            params: log.params,
            timestamp: moment(log.timestamp).utcOffset('-05:00').format('HH:mm:ss - DD/MM/YYYY'),
            usuario: log.Usuario ? {
                idAlumno: log.Usuario.id_usuario,
                nombres: log.Usuario.nombres,
                primerApellido: log.Usuario.primerApellido,
                imagen: log.Usuario.imagen,
                email: log.Usuario.email
            } : null
        }));

        return {
            totalPages,
            currentPage: parseInt(page),
            totalErrorLogs: count,
            errorLogs
        };
    },
};

module.exports = ErrorLogService;