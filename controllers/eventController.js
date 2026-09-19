const Event = require('../models/Event');
const Student = require('../models/Student');

exports.getEvents = async (req, res) => {
  const { status, publicOnly } = req.query;
  const filter = {};

  if (status) filter.status = status;
  
  // If public or student role, show upcoming or active events
  if (publicOnly === 'true' || (req.user && req.user.role === 'student')) {
    filter.status = { $ne: 'cancelled' };
  }

  try {
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    let event;
    if (req.user && (req.user.role === 'admin' || req.user.role === 'headmaster')) {
      // Populated registrations for management view
      event = await Event.findById(req.params.id).populate('registrations', 'studentId fullName class section rollNo email phone');
    } else {
      event = await Event.findById(req.params.id);
    }

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching event details' });
  }
};

exports.createEvent = async (req, res) => {
  const { title, description, date, startTime, endTime, location, image, requiresRegistration, status } = req.body;
  try {
    const event = new Event({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      image,
      requiresRegistration: requiresRegistration !== undefined ? requiresRegistration : false,
      status: status || 'upcoming'
    });
    await event.save();
    res.status(201).json({ event, message: 'Event created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json({ event: updated, message: 'Event updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.requiresRegistration) {
      return res.status(400).json({ message: 'This event does not require registration' });
    }

    if (event.status !== 'upcoming') {
      return res.status(400).json({ message: 'Can only register for upcoming events' });
    }

    // Determine student ID
    let studentId = null;
    if (req.user.role === 'student') {
      studentId = req.user.referenceId;
    } else if (req.body.studentId) {
      studentId = req.body.studentId;
    }

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required for registration' });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if already registered
    if (event.registrations.includes(studentId)) {
      return res.status(400).json({ message: 'Student is already registered for this event' });
    }

    event.registrations.push(studentId);
    await event.save();

    res.json({ event, message: 'Successfully registered for the event' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error registering for event' });
  }
};
