const moment = require('moment');
const { Audit, Usuario } = require('../models');
const { Op, Sequelize } = require('sequelize');

const AuditServices = {
  async getAuditLogs({ page = 1, pageSize = 25, fechaDesde, fechaHasta, userSearch, tableSearch }) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    
    const fromDate = fechaDesde ? moment(fechaDesde, 'YYYY-MM-DD').startOf('day').toISOString() : moment().subtract(30, 'days').startOf('day').toISOString();
    const toDate = fechaHasta ? moment(fechaHasta, 'YYYY-MM-DD').endOf('day').toISOString() : moment().endOf('day').toISOString();

    const whereClause = {
      timestamp: {
        [Op.between]: [fromDate, toDate]
      }
    };

    if (tableSearch) {
      whereClause.tableName = Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('tableName')),
        'LIKE',
        `%${tableSearch.toLowerCase()}%`
      );
    }

    const { count, rows } = await Audit.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          as: 'Usuario',
          attributes: ['id_usuario', 'nombres', 'primerApellido', 'imagen', 'email'],
          where: userSearch ? {
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
                Sequelize.fn('LOWER', Sequelize.col('Usuario.email')),
                'LIKE',
                `%${userSearch.toLowerCase()}%`
              )
            ]
          } : undefined
        }
      ],
      offset,
      limit,
      order: [['timestamp', 'DESC']]
    });

    const totalPages = Math.ceil(count / pageSize);
    const registers = rows.map(row => ({
      id: row.id,
      tableName: row.tableName,
      fechaHora: moment.utc(row.timestamp).utcOffset('-05:00').format('HH:mm:ss - DD/MM/YYYY'),
      action: row.action,
      oldValues: row.oldValues,
      newValues: row.newValues,
      performedBy: {
        idAlumno: row.Usuario ? row.Usuario.id_usuario : null,
        nombres: row.Usuario ? row.Usuario.nombres : null,
        primerApellido: row.Usuario ? row.Usuario.primerApellido : null,
        imagen: row.Usuario ? row.Usuario.imagen : null,
        email: row.Usuario ? row.Usuario.email : null
      }
    }));

    console.log("registros: ", registers);

    return {
      totalPages,
      registers
    };
  }
};

module.exports = AuditServices;
