const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRegistration = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    gen: Joi.string().required(),
    birthday: Joi.date().required(),
    phoneNumber: Joi.string().required(),
    note: Joi.string().optional(),
  }),
};

const getRegistrations = {
  query: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    gen: Joi.string(),
    phoneNumber: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRegistration = {
  params: Joi.object().keys({
    registrationId: Joi.string().custom(objectId),
  }),
};

const updateRegistration = {
  params: Joi.object().keys({
    registrationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      gen: Joi.string(),
      birthday: Joi.date(),
      phoneNumber: Joi.string(),
      note: Joi.string().optional(),
    })
    .min(1),
};

const deleteRegistration = {
  params: Joi.object().keys({
    registrationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRegistration,
  getRegistrations,
  getRegistration,
  updateRegistration,
  deleteRegistration,
};
