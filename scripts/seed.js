const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Announcement = require('../models/Announcement');
const Event = require('../models/Event');
const Admission = require('../models/Admission');
const AcademicRecord = require('../models/AcademicRecord');
const SchoolContent = require('../models/SchoolContent');

// Load environment variables (path relative to where the script runs, which is backend/)
require('dotenv').config();
const dns = require('dns');

// Configure reliable DNS servers to resolve MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {}

const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school_management';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(dbUri, { dbName: 'school_management' });
    console.log('Connected to database. Clearing existing collections...');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Class.deleteMany({});
    await Attendance.deleteMany({});
    await Announcement.deleteMany({});
    await Event.deleteMany({});
    await Admission.deleteMany({});
    await AcademicRecord.deleteMany({});
    await SchoolContent.deleteMany({});

    console.log('Collections cleared. Seeding default homepage CMS content...');

    // 1. Seed CMS content
    const defaultContent = new SchoolContent({
      schoolName: 'Vanguard Academy',
      tagline: 'Excellence in Education, Leadership in Character.',
      logo: '',
      heroHeading: 'Welcome to Vanguard Academy',
      heroDescription: 'A prestigious educational institution dedicated to cultivating academic excellence, leadership, and integrity in our scholars.',
      heroImage: '',
      aboutHeading: 'Cultivating the Leaders of Tomorrow',
      aboutDescription: 'Founded with a vision to provide quality education, Vanguard Academy combines rigorous academics with character development. Our modern campus, dedicated faculty, and vibrant student community create an environment where every scholar can excel.',
      yearsOfExcellence: 25,
      principalName: 'Dr. Evelyn Carter',
      principalDesignation: 'Principal & Academic Director',
      principalMessage: 'Welcome to our digital portal. At Vanguard, we believe in a holistic approach to education. We inspire our scholars to explore their interests, develop critical thinking, and build strong moral character. Together, we shape futures.',
      principalPhoto: '',
      headmasterName: 'Mr. Arthur Pendelton',
      headmasterMessage: 'Our administrative and management portal is designed to keep our school community connected. We invite parents and students to actively engage with academic schedules, events, and announcements here.',
      headmasterPhoto: '',
      address: '102 Academic Boulevard, Education District, NY 10001',
      phone: '+1 (555) 123-4567',
      email: 'info@vanguardacademy.com',
      facebookUrl: 'https://facebook.com',
      twitterUrl: 'https://twitter.com',
      instagramUrl: 'https://instagram.com',
      linkedinUrl: 'https://linkedin.com'
    });
    await defaultContent.save();

    console.log('Seeding teachers...');

    // 2. Seed Teachers
    const teachersData = [
      {
        teacherId: 'TCH-2026-001',
        fullName: 'Mr. Ahmed Khan',
        email: 'ahmed@vanguardacademy.com',
        phone: '+1 (555) 234-5678',
        subject: 'Mathematics',
        qualification: 'M.Sc. in Applied Mathematics',
        assignedClass: 'Grade 6 - A',
        status: 'active'
      },
      {
        teacherId: 'TCH-2026-002',
        fullName: 'Mrs. Sarah Connor',
        email: 'sarah@vanguardacademy.com',
        phone: '+1 (555) 345-6789',
        subject: 'English Literature',
        qualification: 'Ph.D. in English',
        assignedClass: 'Grade 7 - A',
        status: 'active'
      },
      {
        teacherId: 'TCH-2026-003',
        fullName: 'Dr. John Watson',
        email: 'john@vanguardacademy.com',
        phone: '+1 (555) 456-7890',
        subject: 'General Science',
        qualification: 'M.D. & B.Sc. in Biology',
        assignedClass: 'Grade 8 - A',
        status: 'active'
      },
      {
        teacherId: 'TCH-2026-004',
        fullName: 'Prof. David Miller',
        email: 'david@vanguardacademy.com',
        phone: '+1 (555) 567-8902',
        subject: 'Physics',
        qualification: 'M.Sc. in Physics',
        assignedClass: 'Grade 9 - A',
        status: 'active'
      },
      {
        teacherId: 'TCH-2026-005',
        fullName: 'Dr. Emily Vance',
        email: 'emily@vanguardacademy.com',
        phone: '+1 (555) 678-9013',
        subject: 'Chemistry',
        qualification: 'Ph.D. in Organic Chemistry',
        assignedClass: 'Grade 10 - A',
        status: 'active'
      },
      {
        teacherId: 'TCH-2026-006',
        fullName: 'Mr. Arthur Pendelton',
        email: 'headmaster@vanguardacademy.com',
        phone: '+1 (555) 567-8901',
        subject: 'History',
        qualification: 'M.A. in History & School Administration',
        assignedClass: 'None',
        status: 'active'
      }
    ];

    const insertedTeachers = await Teacher.insertMany(teachersData);
    const mathTeacher = insertedTeachers[0];
    const englishTeacher = insertedTeachers[1];
    const scienceTeacher = insertedTeachers[2];
    const physicsTeacher = insertedTeachers[3];
    const chemistryTeacher = insertedTeachers[4];
    const headmasterTeacher = insertedTeachers[5];

    console.log('Seeding classes...');

    // 3. Seed Classes (Grade 6 to Grade 12)
    const classesData = [
      { name: 'Grade 6', section: 'A', classTeacher: mathTeacher._id },
      { name: 'Grade 7', section: 'A', classTeacher: englishTeacher._id },
      { name: 'Grade 8', section: 'A', classTeacher: scienceTeacher._id },
      { name: 'Grade 9', section: 'A', classTeacher: physicsTeacher._id },
      { name: 'Grade 10', section: 'A', classTeacher: chemistryTeacher._id },
      { name: 'Grade 11', section: 'A', classTeacher: mathTeacher._id },
      { name: 'Grade 12', section: 'A', classTeacher: englishTeacher._id }
    ];
    await Class.insertMany(classesData);

    console.log('Seeding users and students...');

    // 4. Create admin account
    const adminUser = new User({
      email: 'admin@vanguardacademy.com',
      password: 'admin123',
      role: 'admin',
      roleRef: 'Teacher' // placeholder
    });
    await adminUser.save();

    // 5. Create Headmaster user account
    const headmasterUser = new User({
      email: 'headmaster@vanguardacademy.com',
      password: 'headmaster123',
      role: 'headmaster',
      referenceId: headmasterTeacher._id,
      roleRef: 'Teacher'
    });
    await headmasterUser.save();

    // 6. Create Student user account & profile
    const mainStudentUser = new User({
      email: 'student@vanguardacademy.com',
      password: 'student123',
      role: 'student',
      roleRef: 'Student'
    });
    await mainStudentUser.save();

    const mainStudent = new Student({
      studentId: 'HIS-2026-001',
      fullName: 'Jane Doe',
      fatherName: 'John Doe Sr.',
      motherName: 'Mary Doe',
      dob: new Date('2014-05-15'),
      gender: 'female',
      class: 'Grade 6',
      section: 'A',
      rollNo: 1,
      phone: '+1 (555) 678-9012',
      email: 'student@vanguardacademy.com',
      address: '742 Evergreen Terrace, Springfield',
      admissionDate: new Date('2024-08-15'),
      photo: '',
      guardianName: 'John Doe Sr.',
      guardianPhone: '+1 (555) 678-9012',
      emergencyContact: '+1 (555) 911-9111',
      status: 'active',
      user: mainStudentUser._id
    });
    await mainStudent.save();

    mainStudentUser.referenceId = mainStudent._id;
    await mainStudentUser.save();

    // Seed additional students to fill tables/analytics
    const extraStudentsData = [
      { name: 'Liam Nelson', roll: 2, gender: 'male', email: 'liam@test.com' },
      { name: 'Olivia Smith', roll: 3, gender: 'female', email: 'olivia@test.com' },
      { name: 'Noah Miller', roll: 4, gender: 'male', email: 'noah@test.com' },
      { name: 'Emma Davis', roll: 5, gender: 'female', email: 'emma@test.com' }
    ];

    const studentIds = [mainStudent._id];

    for (const data of extraStudentsData) {
      const u = new User({
        email: data.email,
        password: 'student123',
        role: 'student',
        roleRef: 'Student'
      });
      await u.save();

      const s = new Student({
        studentId: `HIS-2026-00${data.roll}`,
        fullName: data.name,
        fatherName: `${data.name.split(' ')[1]} Sr.`,
        motherName: `Mrs. ${data.name.split(' ')[1]}`,
        dob: new Date('2014-09-10'),
        gender: data.gender,
        class: 'Grade 6',
        section: 'A',
        rollNo: data.roll,
        phone: '+1 (555) 789-0123',
        email: data.email,
        address: '123 Elm Street, Springville',
        admissionDate: new Date('2025-08-20'),
        photo: '',
        guardianName: `${data.name.split(' ')[1]} Sr.`,
        guardianPhone: '+1 (555) 789-0123',
        emergencyContact: '+1 (555) 234-5678',
        status: 'active',
        user: u._id
      });
      await s.save();

      u.referenceId = s._id;
      await u.save();

      studentIds.push(s._id);
    }

    console.log('Seeding attendance...');

    // 7. Seed Attendance for these students (e.g. past 5 days)
    const attendanceStatuses = ['present', 'present', 'present', 'present', 'present']; // Jane present all days
    const liamStatuses = ['present', 'present', 'absent', 'present', 'present'];
    const oliviaStatuses = ['present', 'absent', 'present', 'present', 'present'];

    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setUTCHours(0, 0, 0, 0);

      // Jane
      await new Attendance({
        student: mainStudent._id,
        date,
        status: attendanceStatuses[i],
        markedBy: adminUser._id
      }).save();

      // Liam
      await new Attendance({
        student: studentIds[1],
        date,
        status: liamStatuses[i],
        markedBy: adminUser._id
      }).save();

      // Olivia
      await new Attendance({
        student: studentIds[2],
        date,
        status: oliviaStatuses[i],
        markedBy: adminUser._id
      }).save();
    }

    console.log('Seeding academic records...');

    // 8. Seed academic records for Jane Doe (main student)
    const term = 'Mid-Term Examination 2026';
    const examRecords = [
      { subject: 'Mathematics', obtained: 88, total: 100, grade: 'A', remarks: 'Excellent logical skills. Keep it up!' },
      { subject: 'English Literature', obtained: 92, total: 100, grade: 'A+', remarks: 'Outstanding essay writer. Shows high creativity.' },
      { subject: 'General Science', obtained: 79, total: 100, grade: 'B', remarks: 'Good performance, but can improve lab reports.' },
      { subject: 'History', obtained: 85, total: 100, grade: 'A', remarks: 'Shows active participation and great recall.' }
    ];

    for (const rec of examRecords) {
      await new AcademicRecord({
        student: mainStudent._id,
        subject: rec.subject,
        totalMarks: rec.total,
        obtainedMarks: rec.obtained,
        grade: rec.grade,
        remarks: rec.remarks,
        examTerm: term
      }).save();
    }

    console.log('Seeding announcements...');

    // 9. Seed announcements
    const announcementsData = [
      {
        title: 'Annual examination schedule updated',
        description: 'The schedule for the midterm examinations has been revised. Please check your student portal or download the PDF from the academics tab. Make sure to note changes in Mathematics and Biology exams.',
        category: 'academic',
        isPublished: true,
        isImportant: true,
        date: new Date('2026-08-20')
      },
      {
        title: 'Admissions Open for Academic Session 2027',
        description: 'We are pleased to announce that registrations for the upcoming academic year are now open. Parents can submit their application forms online via the Admissions portal or visit the school office on weekdays.',
        category: 'admission',
        isPublished: true,
        isImportant: false,
        date: new Date('2026-08-15')
      },
      {
        title: 'Annual Sports Day Registrations',
        description: 'Registrations for track and field events are open. Students can choose to compete in up to three events. Contact the physical education department for signups before Friday.',
        category: 'sports',
        isPublished: true,
        isImportant: false,
        date: new Date('2026-08-10')
      },
      {
        title: 'Draft Schedule for Science Exhibition',
        description: 'Headmaster and teachers will review science fair ideas. Draft plans are submitted to department heads.',
        category: 'academic',
        isPublished: false, // draft / unpublished
        isImportant: false,
        date: new Date('2026-08-21')
      }
    ];
    await Announcement.insertMany(announcementsData);

    console.log('Seeding events...');

    // 10. Seed events
    const eventsData = [
      {
        title: 'Vanguard Science & Tech Fair 2026',
        description: 'Join us for our annual school science exhibition where students showcase innovative projects in engineering, coding, and environmental science. Guest lectures from industry leaders will be held.',
        date: new Date('2026-09-10'),
        startTime: '09:00',
        endTime: '15:00',
        location: 'Main Auditorium & Exhibition Hall',
        requiresRegistration: true,
        status: 'upcoming',
        registrations: [mainStudent._id]
      },
      {
        title: 'Autumn Parent-Teacher Conference',
        description: 'An opportunity for parents to discuss academic progress, behavioral developments, and overall student well-being with subject and class teachers.',
        date: new Date('2026-09-25'),
        startTime: '13:00',
        endTime: '18:00',
        location: 'Individual Classrooms',
        requiresRegistration: false,
        status: 'upcoming',
        registrations: []
      },
      {
        title: 'Inter-School Football Championship',
        description: 'Cheer on the Vanguard Falcons as they take on Spring Valley High in the opening match of the season.',
        date: new Date('2026-08-12'),
        startTime: '16:00',
        endTime: '18:00',
        location: 'School Sports Complex',
        requiresRegistration: false,
        status: 'completed',
        registrations: []
      }
    ];
    await Event.insertMany(eventsData);

    console.log('Seeding admissions...');

    // 11. Seed admission applications
    const admissionsData = [
      {
        applicationId: 'ADM-2026-0001',
        studentName: 'Billy Miller',
        fatherName: 'George Miller',
        motherName: 'Helen Miller',
        dob: new Date('2015-02-10'),
        gender: 'male',
        previousSchool: 'Springfield Primary School',
        previousClass: 'Grade 4',
        applyingClass: 'Grade 5',
        phone: '+1 (555) 908-1234',
        email: 'george@miller.com',
        address: '55 Pine Avenue, Springfield',
        guardianName: 'George Miller',
        guardianPhone: '+1 (555) 908-1234',
        additionalInfo: 'Billy is interested in joining the robotics team.',
        status: 'pending'
      },
      {
        applicationId: 'ADM-2026-0002',
        studentName: 'Lily Potter',
        fatherName: 'James Potter',
        motherName: 'Lily Potter Sr.',
        dob: new Date('2014-07-31'),
        gender: 'female',
        previousSchool: 'Hogwarts Prep School',
        previousClass: 'Grade 5',
        applyingClass: 'Grade 6',
        phone: '+1 (555) 999-8888',
        email: 'lily@potter.com',
        address: '4 Privet Drive, Little Whinging',
        guardianName: 'James Potter',
        guardianPhone: '+1 (555) 999-8888',
        additionalInfo: 'Excellent reading and history performance.',
        status: 'approved'
      },
      {
        applicationId: 'ADM-2026-0003',
        studentName: 'Bobby Drake',
        fatherName: 'William Drake',
        motherName: 'Madeline Drake',
        dob: new Date('2013-11-20'),
        gender: 'male',
        previousSchool: 'Xavier Academy',
        previousClass: 'Grade 6',
        applyingClass: 'Grade 7',
        phone: '+1 (555) 111-2222',
        email: 'william@drake.com',
        address: '1407 Graymalkin Lane, Salem',
        guardianName: 'William Drake',
        guardianPhone: '+1 (555) 111-2222',
        additionalInfo: 'Enjoys ice skating and sports.',
        status: 'rejected'
      }
    ];
    await Admission.insertMany(admissionsData);

    console.log('Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Accounts:');
    console.log('1. Admin: admin@vanguardacademy.com / admin123');
    console.log('2. Headmaster: headmaster@vanguardacademy.com / headmaster123');
    console.log('3. Student: student@vanguardacademy.com / student123 (Jane Doe)');
    console.log('----------------------------------------------------');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
