const AcademicRecord = require('../models/AcademicRecord');
const Student = require('../models/Student');

const calculateGrade = (obtained, total) => {
  const percentage = (obtained / total) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

exports.addResult = async (req, res) => {
  const { studentId, subject, totalMarks, obtainedMarks, examTerm, remarks } = req.body;
  try {
    if (!studentId || !subject || obtainedMarks === undefined || !examTerm) {
      return res.status(400).json({ message: 'Student, subject, obtained marks, and exam term are required' });
    }

    const studentExists = await Student.findById(studentId);
    if (!studentExists) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const grade = calculateGrade(Number(obtainedMarks), Number(totalMarks || 100));

    // Check if result already exists for student, subject, and term. If so, update it.
    let record = await AcademicRecord.findOne({ student: studentId, subject, examTerm });
    if (record) {
      record.totalMarks = Number(totalMarks || 100);
      record.obtainedMarks = Number(obtainedMarks);
      record.grade = grade;
      record.remarks = remarks || '';
      await record.save();
    } else {
      record = new AcademicRecord({
        student: studentId,
        subject,
        totalMarks: Number(totalMarks || 100),
        obtainedMarks: Number(obtainedMarks),
        grade,
        remarks: remarks || '',
        examTerm
      });
      await record.save();
    }

    res.status(201).json({ record, message: 'Academic record saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving academic record' });
  }
};

exports.getStudentResults = async (req, res) => {
  const studentId = req.params.studentId || (req.user.role === 'student' ? req.user.referenceId : null);
  try {
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Verify student is accessing their own data unless admin/headmaster
    if (req.user.role === 'student' && req.user.referenceId.toString() !== studentId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to view other students records' });
    }

    const records = await AcademicRecord.find({ student: studentId }).sort({ examTerm: 1, subject: 1 });
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching academic results' });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const record = await AcademicRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Academic record not found' });
    }

    await AcademicRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Academic record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting academic record' });
  }
};
