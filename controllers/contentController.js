const SchoolContent = require('../models/SchoolContent');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

exports.getSchoolContent = async (req, res) => {
  try {
    let content = await SchoolContent.findOne();
    if (!content) {
      content = new SchoolContent();
      await content.save();
    }
    res.json(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching content settings' });
  }
};

exports.updateSchoolContent = async (req, res) => {
  try {
    let content = await SchoolContent.findOne();
    if (!content) {
      content = new SchoolContent();
    }
    
    // Update fields from body
    Object.keys(req.body).forEach(key => {
      content[key] = req.body[key];
    });

    await content.save();
    res.json({ content, message: 'Homepage and school settings updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating content settings' });
  }
};

exports.getSchoolStats = async (req, res) => {
  try {
    const studentCount = await Student.countDocuments({ status: 'active' });
    const teacherCount = await Teacher.countDocuments({ status: 'active' });
    
    // Count unique class names, or simply the number of documents in Class model
    const classCount = await Class.countDocuments();
    
    let content = await SchoolContent.findOne();
    const yearsOfExcellence = content ? content.yearsOfExcellence : 25;

    res.json({
      students: studentCount || 0,
      teachers: teacherCount || 0,
      classes: classCount || 0,
      yearsOfExcellence
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error compiling school statistics' });
  }
};
