const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      enum: ['Startup', 'Small', 'Medium', 'Large', 'Enterprise'],
      default: 'Medium'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
