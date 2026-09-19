const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const AcademicRecord = require('../models/AcademicRecord');

exports.getStudents = async (req, res) => {
  const { search, class: classFilter, section, gender, status } = req.query;
  const filter = {};

  if (classFilter) filter.class = classFilter;
  if (section) filter.section = section;
  if (gender) filter.gender = gender;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const students = await Student.find(filter).sort({ rollNo: 1 });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch Academic Records
    const academicRecords = await AcademicRecord.find({ student: student._id });

    // Fetch Attendance summary
    const attendance = await Attendance.find({ student: student._id });
    const totalDays = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const leave = attendance.filter(a => a.status === 'leave').length;
    const attendancePercentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 100;

    res.json({
      student,
      academicRecords,
      attendanceSummary: {
        totalDays,
        present,
        absent,
        leave,
        attendancePercentage
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching student details' });
  }
};

exports.createStudent = async (req, res) => {
  const {
    fullName, fatherName, motherName, dob, gender,
    class: studentClass, section, rollNo, phone, email,
    address, photo, guardianName, guardianPhone, emergencyContact,
    status
  } = req.body;

  try {
    // Check if email already exists in User model
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Generate unique student ID (e.g. HIS2026001, incremental based on DB count)
    const count = await Student.countDocuments();
    const studentId = `HIS-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    // 1. Create linked Student User login account
    const user = new User({
      email,
      password: 'student123', // Default password
      role: 'student',
      roleRef: 'Student'
    });
    await user.save();

    // 2. Create Student profile
    const student = new Student({
      studentId, fullName, fatherName, motherName, dob, gender,
      class: studentClass, section, rollNo, phone, email,
      address, photo, guardianName, guardianPhone, emergencyContact,
      status: status || 'active',
      user: user._id
    });
    await student.save();

    // Link user reference back to student
    user.referenceId = student._id;
    await user.save();

    res.status(201).json({ student, message: 'Student and login account created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating student' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if email changed and if new email is in use
    if (req.body.email && req.body.email !== student.email) {
      const emailInUse = await User.findOne({ email: req.body.email });
      if (emailInUse) {
        return res.status(400).json({ message: 'New email address already in use' });
      }
      
      // Update email in linked User account
      if (student.user) {
        await User.findByIdAndUpdate(student.user, { email: req.body.email });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json({ student: updatedStudent, message: 'Student updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating student' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // 1. Delete linked User login account
    if (student.user) {
      await User.findByIdAndDelete(student.user);
    }

    // 2. Delete attendance records
    await Attendance.deleteMany({ student: student._id });

    // 3. Delete academic records
    await AcademicRecord.deleteMany({ student: student._id });

    // 4. Delete Student document
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: 'Student and associated accounts deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting student' });
  }
};
