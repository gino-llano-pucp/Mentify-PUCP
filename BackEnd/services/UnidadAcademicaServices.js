const { raw } = require('express');
const db = require('../models');
const sequelize = db.sequelize;
const UnidadAcademica = db.UnidadAcademica;
const Usuario = db.Usuario;
const { Sequelize, Op, where } = require('sequelize');

const UnidadAcademicaServices = {
    async insertar(unidadData, performedBy) {
        const transaction = await sequelize.transaction();
        try {
            const exists = await UnidadAcademica.findOne({
                where: {
                    [Sequelize.Op.or]: [
                        { nombre: unidadData.nombre },
                        { siglas: unidadData.siglas },
                        { correoDeContacto: unidadData.correoDeContacto }
                    ]
                },
                transaction: transaction
            });
    
            if (exists) {
               
                throw new Error('Ya existe una unidad académica con el mismo nombre, siglas o correo de contacto.');
            }
    
            // Crear la nueva unidad académica si no existen conflictos
            const nuevaUnidad = await UnidadAcademica.create(unidadData, { transaction , performedBy, individualHooks: true});
            await transaction.commit();
            return nuevaUnidad;
        } catch (error) {
            await transaction.rollback();
            throw error; 
        }
    },

    async obtenerTodos() {
        try {
            return await UnidadAcademica.findAll({
                order: [
                    ["nombre", "ASC"]
                ]
            });
        } catch (error) {
            throw error;
        }
    },

    async obtenerPorId(id) {
        try {
            return await UnidadAcademica.findByPk(id, {
                include: [{
                    model: Usuario,
                    as: 'Encargado'
                }]
            });
        } catch (error) {
            throw error;
        }
    },

    async listarPorPaginacion(page, pageSize, sortBy, sortOrder, searchCriterias = []) {
        const limit = parseInt(pageSize);
        const offset = (page - 1) * limit;
    
        let orConditions = [];
        let andConditions = [];
    
        searchCriterias.forEach(term => {
            if (term.field && term.value) {
                let condition = {};
                if (term.field === 'esActivo') {
                    condition[term.field] = {
                        [Op.eq]: term.value
                    };
                    andConditions.push(condition);
                } else {
                    condition[term.field] = {
                        [Op.like]: `%${term.value}%`
                    };
                    orConditions.push(condition);
                }
            }
        });
    
        let whereClause = {};
        if (orConditions.length > 0) {
            whereClause[Op.or] = orConditions;
        }
        if (andConditions.length > 0) {
            whereClause[Op.and] = andConditions;
        }
    
        console.log("Condiciones: ", whereClause);
    
        const unidades = await UnidadAcademica.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, sortOrder]],
            attributes: ['id_unidad_academica', 'nombre', 'siglas', 'correoDeContacto', 'esActivo', 'fechaCreacion'],
            where: whereClause,
            order: [
              ["nombre", "ASC"],
            ]
        });
    
        return {
            totalPages: Math.ceil(unidades.count / limit),
            currentPage: parseInt(page),
            totalUnidades: unidades.count,
            unidades: unidades.rows.map(unid => {
                return {
                    id_unidad_academica: unid.id_unidad_academica,
                    nombre: unid.nombre,
                    siglas: unid.siglas,
                    correoDeContacto: unid.correoDeContacto,
                    esActivo: unid.esActivo === 1 ? 'Activo' : 'Inactivo',
                    fechaCreacion: unid.fechaCreacion
                };
            })
        };
    },
    


    async cargaMasivaUnidadesAcademicas(unidades, performedBy) {
        const transaction = await sequelize.transaction();
        const unidadesRepetidas = [];
        const unidadesUnicas = [];
        try {
            const unidadesAcademicasExistentes = await UnidadAcademica.findAll({
                attributes: ['siglas'],
                raw: true
            });

            //validacion para eliminar a las unidades repetidas y que no se registren duplicados
            for (const unidad of unidades) {
                if (unidadesAcademicasExistentes.some(u => u.siglas === unidad.siglas)) {
                    unidadesRepetidas.push(unidad);
                }
                else{
                    unidadesUnicas.push(unidad);
                }
            }

            if(unidadesUnicas.length === 0){
                await transaction.rollback();
                return { message: 'No se cargaron unidades académicas, todas estaban duplicadas' };
            }

            const unidadesAcademicas = await UnidadAcademica.bulkCreate(unidadesUnicas, { transaction , performedBy, individualHooks: true});
            await transaction.commit();
            return {
                'Unidades cargadas': unidadesAcademicas,
                'Unidades no cargadas porque ya existen': unidadesRepetidas
            }
        } catch (error) {
            await transaction.rollback();
            throw new Error('Error al cargar las unidades académicas');
        }
    },
    async deleteUnidadAcademica(id_unidad_academica, performedBy) {
        try {
          const unidadAcademica = await UnidadAcademica.findByPk(id_unidad_academica);
          if (!unidadAcademica) {
            return { message: 'UnidadAcademica not found' };
          }
          // actualizar el estado de la unidad academica
          await unidadAcademica.update({ esActivo: false }, { performedBy, individualHooks: true }); // Logical delete

          return { message: 'UnidadAcademica logically deleted successfully' };
        } catch (error) {
          console.error('Error deleting UnidadAcademica:', error);
          throw new Error('Error deleting UnidadAcademica');
        }
    },
    async editUnidadAcademica({ id_unidad_academica, nombre, siglas, correoDeContacto, esActivo, performedBy }) {
        const transaction = await sequelize.transaction();
        
        
          const unidadAcademica = await UnidadAcademica.findByPk(id_unidad_academica);
          if (!unidadAcademica) {
            return { message: 'UnidadAcademica not found' };
          }
          const exists = await UnidadAcademica.findOne({
            where: {
                id_unidad_academica: { [sequelize.Sequelize.Op.ne]: id_unidad_academica },
                [sequelize.Sequelize.Op.or]: [
                    nombre ? { nombre } : undefined,
                    siglas ? { siglas } : undefined,
                    correoDeContacto ? { correoDeContacto } : undefined
                ].filter(Boolean)
            },
            transaction
        });

        console.log("RESPONSABLEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",exists);
        if (exists) {
            await transaction.rollback();
            throw new Error("Existe otra Unidad Académica con el mismo nombre, siglas o correo");
        }




          unidadAcademica.nombre = nombre || unidadAcademica.nombre;
          unidadAcademica.siglas = siglas || unidadAcademica.siglas;
          unidadAcademica.correoDeContacto = correoDeContacto || unidadAcademica.correoDeContacto;
          unidadAcademica.esActivo = esActivo !== undefined ? esActivo : unidadAcademica.esActivo;

          
          await unidadAcademica.save({ transaction , performedBy, individualHooks: true});
          await transaction.commit();
          return { message: 'UnidadAcademica updated successfully' };
        
    },

    async activarUnidadAcademica(id_unidad_academica, performedBy){
        const unidadAcademica = await UnidadAcademica.findByPk(id_unidad_academica);
        if (!unidadAcademica)
            throw new Error("El id de la unidad academica enviado no existe");
        if (unidadAcademica.esActivo)
            throw new Error("No se puede activar una unidad academica que ya se encuentra activa")
        await unidadAcademica.update({
            esActivo: true
        }, { performedBy, individualHooks: true });
        return { 
            message: "Unidad academica activada con exito",
            resultado: unidadAcademica
        }
    }
};

module.exports = UnidadAcademicaServices;
