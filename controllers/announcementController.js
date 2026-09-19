const Announcement = require('../models/Announcement');

exports.getAnnouncements = async (req, res) => {
  const { category, publicOnly } = req.query;
  const filter = {};

  if (category) filter.category = category;
  
  // If request is from public website or student role, only show published ones
  if (publicOnly === 'true' || (req.user && req.user.role === 'student')) {
    filter.isPublished = true;
  }

  try {
    const announcements = await Announcement.find(filter).sort({ isImportant: -1, date: -1 });
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching announcements' });
  }
};

exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching announcement' });
  }
};

exports.createAnnouncement = async (req, res) => {
  const { title, description, category, image, isPublished, isImportant, date } = req.body;
  try {
    const announcement = new Announcement({
      title,
      description,
      category,
      image,
      isPublished: isPublished !== undefined ? isPublished : true,
      isImportant: isImportant !== undefined ? isImportant : false,
      date: date || new Date()
    });
    await announcement.save();
    res.status(201).json({ announcement, message: 'Announcement created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating announcement' });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({ announcement: updated, message: 'Announcement updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating announcement' });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting announcement' });
  }
};
