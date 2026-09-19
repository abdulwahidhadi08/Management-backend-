const Teacher = require('../models/Teacher');
const User = require('../models/User');

exports.getTeachers = async (req, res) => {
  const { search, subject, status } = req.query;
  const filter = {};

  if (subject) filter.subject = subject;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { teacherId: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const teachers = await Teacher.find(filter).sort({ fullName: 1 });
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching teachers' });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching teacher details' });
  }
};

exports.createTeacher = async (req, res) => {
  const { fullName, email, phone, subject, qualification, assignedClass, status, photo } = req.body;
  try {
    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'A teacher with this email already exists' });
    }

    const count = await Teacher.countDocuments();
    const teacherId = `TCH-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const teacher = new Teacher({
      teacherId,
      fullName,
      photo,
      email,
      phone,
      subject,
      qualification,
      assignedClass: assignedClass || 'None',
      status: status || 'active'
    });
    await teacher.save();

    res.status(201).json({ teacher, message: 'Teacher created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating teacher' });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (req.body.email && req.body.email !== teacher.email) {
      const emailInUse = await Teacher.findOne({ email: req.body.email });
      if (emailInUse) {
        return res.status(400).json({ message: 'Email address already in use by another teacher' });
      }
    }

    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({ teacher: updated, message: 'Teacher updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating teacher' });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting teacher' });
  }
};
