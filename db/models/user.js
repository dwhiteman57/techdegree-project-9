'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                  args: true,
                  msg: 'First Name is required'
                }
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'Last Name is required'
                }
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'Email address is required'
              },
            isEmail: true
            },
            unique: {
              args: true,
              msg: 'Email address already in use!'
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'Password is required'
                }
            }
        },
    }, { sequelize });
    User.associate = (models) => {
        User.hasMany(models.Course, { 
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return User;
};