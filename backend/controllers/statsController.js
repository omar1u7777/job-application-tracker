const Application = require('../models/Application');
const Company = require('../models/Company');

const getApplicationSummary = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const statusBreakdown = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusMap = { pending: 0, interview: 0, accepted: 0, rejected: 0 };
    statusBreakdown.forEach(item => {
      statusMap[item._id] = item.count;
    });

    const avgResponseTime = await Application.aggregate([
      {
        $match: {
          expectedReplyDate: { $exists: true, $ne: null },
          dateApplied: { $exists: true, $ne: null }
        }
      },
      {
        $project: {
          diffInDays: {
            $divide: [
              { $subtract: ['$expectedReplyDate', '$dateApplied'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgDays: { $avg: '$diffInDays' }
        }
      }
    ]);

    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('companyId', 'name location');

    res.status(200).json({
      success: true,
      data: {
        totalApplications,
        statusBreakdown: statusMap,
        avgResponseDays: avgResponseTime.length > 0 ? Math.round(avgResponseTime[0].avgDays) : 0,
        recentApplications
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCompanyStats = async (req, res) => {
  try {
    const companiesWithCounts = await Company.aggregate([
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'companyId',
          as: 'applications'
        }
      },
      {
        $project: {
          name: 1,
          location: 1,
          applicationCount: { $size: '$applications' }
        }
      },
      { $sort: { applicationCount: -1 } }
    ]);

    res.status(200).json({ success: true, data: companiesWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getApplicationSummary,
  getCompanyStats
};
