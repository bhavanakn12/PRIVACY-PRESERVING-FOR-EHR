const { maskPhone, maskName, maskAddress } = require('../utils/privacyUtils');

function privacyPatientView(req, res, next) {
  // For staff: mask phone, name, address
  if (res.locals.staffPatients && Array.isArray(res.locals.staffPatients)) {
    res.locals.staffPatients = res.locals.staffPatients.map(pt => ({
      ...pt.toObject(),
      phone: maskPhone(pt.phone || ""),
      name: maskName(pt.name || ""),
      address: maskAddress(pt.address || "")
    }));
  }
  next();
}

module.exports = privacyPatientView;
