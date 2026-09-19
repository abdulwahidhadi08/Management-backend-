const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Normalize date to YYYY-MM-DD at midnight UTC
const normalizeDate = (dateStr) => {
  const d = new Date(dateStr);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

exports.getAttendanceSheet = async (req, res) => {
  const { class: className, section, date } = req.query;
  try {
    if (!className || !section || !date) {
      return res.status(400).json({ message: 'Class, section, and date are required' });
    }

    const normalizedDate = normalizeDate(date);
    const students = await Student.find({ class: className, section, status: 'active' }).sort({ rollNo: 1 });

    const attendanceRecords = await Attendance.find({
      date: normalizedDate,
      student: { $in: students.map(s => s._id) }
    });

    const sheet = students.map(student => {
      const record = attendanceRecords.find(r => r.student.toString() === student._id.toString());
      return {
        studentId: student._id,
        studentRegId: student.studentId,
        fullName: student.fullName,
        rollNo: student.rollNo,
        status: record ? record.status : 'present' // default to present if not marked
      };
    });

    res.json(sheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error loading attendance sheet' });
  }
};

exports.saveAttendance = async (req, res) => {
  const { date, records } = req.body;
  try {
    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Date and records array are required' });
    }

    const normalizedDate = normalizeDate(date);

    const operations = records.map(record => ({
      updateOne: {
        filter: { student: record.studentId, date: normalizedDate },
        update: {
          $set: {
            status: record.status,
            markedBy: req.user._id
          }
        },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(operations);

    res.json({ message: 'Attendance records saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving attendance' });
  }
};

exports.getStudentAttendance = async (req, res) => {
  const studentId = req.params.studentId || (req.user.role === 'student' ? req.user.referenceId : null);
  try {
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Verify student is accessing their own data unless admin/headmaster
    if (req.user.role === 'student' && req.user.referenceId.toString() !== studentId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to view other students records' });
    }

    const records = await Attendance.find({ student: studentId }).sort({ date: -1 });

    const totalDays = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const leave = records.filter(r => r.status === 'leave').length;
    const attendancePercentage = totalDays > 0 ? Math.round((present / totalDays) * 100) : 100;

    res.json({
      summary: {
        totalDays,
        present,
        absent,
        leave,
        attendancePercentage
      },
      records
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching student attendance' });
  }
};
