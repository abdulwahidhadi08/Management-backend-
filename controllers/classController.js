const Class = require('../models/Class');
const Student = require('../models/Student');

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('classTeacher');
    
    const classesWithCounts = await Promise.all(classes.map(async (cls) => {
      const studentCount = await Student.countDocuments({
        class: cls.name,
        section: cls.section
      });
      return {
        ...cls.toObject(),
        studentCount
      };
    }));

    res.json(classesWithCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching classes' });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).populate('classTeacher');
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const students = await Student.find({ class: cls.name, section: cls.section });
    res.json({
      class: cls,
      students,
      studentCount: students.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching class details' });
  }
};

exports.createClass = async (req, res) => {
  const { name, section, classTeacher } = req.body;
  try {
    const existing = await Class.findOne({ name, section });
    if (existing) {
      return res.status(400).json({ message: `Class ${name} Section ${section} already exists` });
    }

    const newClass = new Class({ name, section, classTeacher });
    await newClass.save();

    const populated = await Class.findById(newClass._id).populate('classTeacher');
    res.status(201).json({ class: populated, message: 'Class created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating class' });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('classTeacher');

    res.json({ class: updated, message: 'Class updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating class' });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting class' });
  }
};
