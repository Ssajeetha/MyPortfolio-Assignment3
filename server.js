import config from './config/config.js';
import app from './server/express.js';
import mongoose from 'mongoose';
import User from './server/models/user.model.js'; 
import Project from './server/models/project.model.js';

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log("Connected to the database!");

     
    try {
      let existingAdmin = await User.findOne({ email: 'Loshika@admin.com' });
      if (!existingAdmin) {
        const adminUser = new User({
          name: 'Loshika',
          email: 'Loshika@admin.com',
          password: 'AdminPassword123',
          role: 'admin'
        });
        await adminUser.save();
        console.log("Hardcoded Admin account created successfully!");
      } else {
        // If it already exists, make sure the name is updated to Loshika
        existingAdmin.name = 'Loshika';
        await existingAdmin.save();
        console.log("Admin name updated in MongoDB to Loshika!");
      }
    } catch (err) {
      console.log("Error updating admin user:", err.message);
    }

        // Seed Campus Student Marketplace project if it doesn't exist
    try {
      const existingProject = await Project.findOne({ title: 'Campus Student Marketplace' });
      if (!existingProject) {
        const newProject = new Project({
          title: 'Campus Student Marketplace',
          firstname: 'Loshika',
          lastname: 'Pragasam',
          email: 'lpragasa@my.centennialcollege.ca',
          description: 'A collaborative web portal for college students to securely buy, sell, and exchange used textbooks and study hardware.',
          completion: new Date('2026-11-01')
        });
        await newProject.save();
        console.log("Hardcoded project 'Campus Student Marketplace' saved to MongoDB!");
      }
    } catch (err) {
      console.log("Error seeding project:", err.message);
    }
  });

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});

app.get('/', (req, res) => {
  res.json({ message: "Welcome to My Portfolio application." });
});

app.listen(config.port, (err) => { 
  if (err) {
    console.log(err);
  }
  console.info('Server started on port %s.', config.port);
});