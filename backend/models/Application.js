const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required']
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      maxlength: [100, 'Position cannot exceed 100 characters']
    },
    salaryRange: {
      type: String,
      required: [true, 'Salary range is required'],
      trim: true
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['pending', 'interview', 'accepted', 'rejected'],
        message: 'Status must be pending, interview, accepted, or rejected'
      },
      default: 'pending'
    },
    dateApplied: {
      type: Date,
      required: [true, 'Date applied is required'],
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: 'Date applied cannot be in the future'
      }
    },
    expectedReplyDate: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v) return true;
          if (!this.dateApplied) return true;
          return v >= this.dateApplied;
        },
        message: 'Expected reply date must be after or equal to date applied'
      }
    },
    applicationNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
