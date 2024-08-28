const httpStatus = require('http-status');
const { DangKy } = require('../models');
const ApiError = require('../utils/ApiError');
const { emailService } = require('.');

/**
 * Create a registration (dang ky)
 * @param {Object} registrationBody
 * @returns {Promise<DangKy>}
 */
const createRegistration = async (registrationBody) => {
  if (await DangKy.isEmailTaken(registrationBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã tồn tại');
  }
  emailService.sendConfirmBirthdayEmail(registrationBody.email);
  return DangKy.create(registrationBody);
};

/**
 * Query for registrations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRegistrations = async (filter, options) => {
  const registrations = await DangKy.paginate(filter, options);
  return registrations;
};

/**
 * Get registration by id
 * @param {ObjectId} id
 * @returns {Promise<DangKy>}
 */
const getRegistrationById = async (id) => {
  return DangKy.findById(id);
};

/**
 * Get registration by email
 * @param {string} email
 * @returns {Promise<DangKy>}
 */
const getRegistrationByEmail = async (email) => {
  return DangKy.findOne({ email });
};

/**
 * Update registration by id
 * @param {ObjectId} registrationId
 * @param {Object} updateBody
 * @returns {Promise<DangKy>}
 */
const updateRegistrationById = async (registrationId, updateBody) => {
  const registration = await getRegistrationById(registrationId);
  if (!registration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Registration not found');
  }
  if (updateBody.email && (await DangKy.isEmailTaken(updateBody.email, registrationId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(registration, updateBody);
  await registration.save();
  return registration;
};

/**
 * Delete registration by id
 * @param {ObjectId} registrationId
 * @returns {Promise<DangKy>}
 */
const deleteRegistrationById = async (registrationId) => {
  const registration = await getRegistrationById(registrationId);
  if (!registration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Registration not found');
  }
  await registration.remove();
  return registration;
};

module.exports = {
  createRegistration,
  queryRegistrations,
  getRegistrationById,
  getRegistrationByEmail,
  updateRegistrationById,
  deleteRegistrationById,
};
