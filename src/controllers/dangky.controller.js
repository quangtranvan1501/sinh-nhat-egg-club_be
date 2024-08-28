const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { registrationService } = require('../services');

const createRegistration = catchAsync(async (req, res) => {
  const registration = await registrationService.createRegistration(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Đăng ký tham gia thành công',
    data: registration
  });
});

const getRegistrations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'email', 'gen', 'phoneNumber']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await registrationService.queryRegistrations(filter, options);
  res.send(result);
});

const getRegistration = catchAsync(async (req, res) => {
  const registration = await registrationService.getRegistrationById(req.params.registrationId);
  if (!registration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Registration not found');
  }
  res.send(registration);
});

const updateRegistration = catchAsync(async (req, res) => {
  const registration = await registrationService.updateRegistrationById(req.params.registrationId, req.body);
  res.send(registration);
});

const deleteRegistration = catchAsync(async (req, res) => {
  await registrationService.deleteRegistrationById(req.params.registrationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRegistration,
  getRegistrations,
  getRegistration,
  updateRegistration,
  deleteRegistration,
};
