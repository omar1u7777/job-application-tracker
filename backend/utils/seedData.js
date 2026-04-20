const mongoose = require('mongoose');
const Company = require('../models/Company');
const Application = require('../models/Application');
const Contact = require('../models/Contact');

const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected for seeding');
    }

    await Company.deleteMany({});
    await Application.deleteMany({});
    await Contact.deleteMany({});

    const companies = await Company.insertMany([
      {
        name: 'Google Sweden',
        location: 'Stockholm',
        industry: 'Technology',
        website: 'https://careers.google.com',
        size: 'Enterprise'
      },
      {
        name: 'Spotify',
        location: 'Göteborg',
        industry: 'Technology',
        website: 'https://www.spotifyjobs.com',
        size: 'Large'
      },
      {
        name: 'Volvo Group',
        location: 'Göteborg',
        industry: 'Automotive',
        website: 'https://www.volvogroup.com',
        size: 'Enterprise'
      },
      {
        name: 'Klarna',
        location: 'Stockholm',
        industry: 'Fintech',
        website: 'https://www.klarna.com/careers',
        size: 'Large'
      },
      {
        name: 'H&M',
        location: 'Stockholm',
        industry: 'Retail',
        website: 'https://career.hm.com',
        size: 'Enterprise'
      }
    ]);

    const googleId = companies[0]._id;
    const spotifyId = companies[1]._id;
    const volvoId = companies[2]._id;
    const klarnaId = companies[3]._id;
    const hmId = companies[4]._id;

    await Application.insertMany([
      {
        companyId: googleId,
        position: 'Junior Developer',
        salaryRange: '25–30k',
        status: 'interview',
        dateApplied: new Date('2026-04-20'),
        expectedReplyDate: new Date('2026-05-05'),
        applicationNotes: 'Phone interview scheduled for April 28. Contact: maria.svensson@google.com'
      },
      {
        companyId: spotifyId,
        position: 'Frontend Developer',
        salaryRange: '30–35k',
        status: 'pending',
        dateApplied: new Date('2026-04-18'),
        expectedReplyDate: new Date('2026-05-02'),
        applicationNotes: 'Applied via referral from former classmate'
      },
      {
        companyId: volvoId,
        position: 'Backend Developer',
        salaryRange: '28–32k',
        status: 'rejected',
        dateApplied: new Date('2026-04-15'),
        expectedReplyDate: new Date('2026-04-30'),
        applicationNotes: 'Received rejection email on April 22. Position filled internally.'
      },
      {
        companyId: klarnaId,
        position: 'Full Stack Developer',
        salaryRange: '26–31k',
        status: 'accepted',
        dateApplied: new Date('2026-04-10'),
        expectedReplyDate: new Date('2026-04-25'),
        applicationNotes: 'Offer received on April 23. Negotiating start date.'
      },
      {
        companyId: hmId,
        position: 'Junior Developer',
        salaryRange: '24–28k',
        status: 'pending',
        dateApplied: new Date('2026-04-22'),
        expectedReplyDate: new Date('2026-05-06'),
        applicationNotes: 'Applied through university career portal'
      }
    ]);

    await Contact.insertMany([
      {
        companyId: googleId,
        name: 'Maria Svensson',
        role: 'Talent Acquisition Specialist',
        email: 'maria.svensson@google.com',
        phone: '+46 8 123 4567',
        isPrimary: true
      },
      {
        companyId: spotifyId,
        name: 'Erik Johansson',
        role: 'Engineering Manager',
        email: 'erik.j@spotify.com',
        isPrimary: true
      },
      {
        companyId: volvoId,
        name: 'Anna Lindgren',
        role: 'HR Business Partner',
        email: 'anna.lindgren@volvo.com',
        phone: '+46 31 456 7890',
        isPrimary: false
      },
      {
        companyId: klarnaId,
        name: 'Lars Nilsson',
        role: 'Tech Lead',
        email: 'lars.nilsson@klarna.com',
        isPrimary: true
      },
      {
        companyId: hmId,
        name: 'Sofia Andersson',
        role: 'Recruiter',
        email: 'sofia.andersson@hm.com',
        isPrimary: true
      }
    ]);

    console.log('Database seeded successfully');
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB disconnected');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase();
}
