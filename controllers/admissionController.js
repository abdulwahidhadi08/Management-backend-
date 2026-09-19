const Admission = require('../models/Admission');

exports.getAdmissions = async (req, res) => {
  const { class: classFilter, status, search } = req.query;
  const filter = {};

  if (classFilter) filter.applyingClass = classFilter;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { applicationId: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const applications = await Admission.find(filter).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching admission applications' });
  }
};

exports.getAdmissionById = async (req, res) => {
  try {
    const application = await Admission.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Admission application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching application details' });
  }
};

exports.createAdmissionApplication = async (req, res) => {
  const {
    studentName, fatherName, motherName, dob, gender,
    previousSchool, previousClass, applyingClass, phone, email,
    address, guardianName, guardianPhone, additionalInfo
  } = req.body;

  try {
    const count = await Admission.countDocuments();
    const applicationId = `ADM-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const application = new Admission({
      applicationId, studentName, fatherName, motherName, dob, gender,
      previousSchool: previousSchool || 'None',
      previousClass: previousClass || 'None',
      applyingClass, phone, email,
      address, guardianName, guardianPhone, additionalInfo
    });

    await application.save();

    res.status(201).json({
      applicationId,
      message: 'Admission application submitted successfully!',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error submitting application' });
  }
};

exports.updateAdmissionStatus = async (req, res) => {
  const { status } = req.body;
  try {
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Admission.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Admission application not found' });
    }

    application.status = status;
    await application.save();

    res.json({ application, message: `Application marked as ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating application status' });
  }
};
