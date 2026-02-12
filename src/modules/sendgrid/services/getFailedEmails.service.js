const client = require('@sendgrid/client');
const logger = require('../../../config/logger');

const apiKey = process.env.SENDGRID_API_KEY;
client.setApiKey(apiKey);

const getFailedEmails = async (days = 1, filterStatus = 'all') => {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const startTime = Math.floor(startDate.getTime() / 1000);
    const endTime = Math.floor(endDate.getTime() / 1000);

    let bounces = [];
    let blocks = [];
    let invalids = [];
    let spamReports = [];

    // Fetch bounces (hard bounces) if needed
    if (filterStatus === 'all' || filterStatus === 'bounce') {
      try {
        const [bouncesResponse] = await client.request({
          url: '/v3/suppression/bounces',
          method: 'GET',
          qs: { start_time: startTime, end_time: endTime }
        });
        
        bounces = (bouncesResponse.body || []).map(item => ({
          email: item.email,
          reason: item.reason || 'Unknown bounce reason',
          status: 'bounce',
          bounceClassification: 'hard',
          timestamp: new Date(item.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          createdTimestamp: item.created,
          smtpResponse: item.status || 'N/A'
        }));
      } catch (err) {
        logger.warn(`Failed to fetch bounces: ${err.message}`);
      }
    }

    // Fetch blocks (soft bounces/temporary failures) if needed
    if (filterStatus === 'all' || filterStatus === 'blocked' || filterStatus === 'dropped') {
      try {
        const [blocksResponse] = await client.request({
          url: '/v3/suppression/blocks',
          method: 'GET',
          qs: { start_time: startTime, end_time: endTime }
        });
        
        blocks = (blocksResponse.body || []).map(item => ({
          email: item.email,
          reason: item.reason || 'Email blocked/dropped',
          status: 'blocked',
          bounceClassification: 'soft',
          timestamp: new Date(item.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          createdTimestamp: item.created,
          smtpResponse: item.status || 'N/A'
        }));
      } catch (err) {
        logger.warn(`Failed to fetch blocks: ${err.message}`);
      }
    }

    // Fetch invalid emails
    if (filterStatus === 'all' || filterStatus === 'invalid') {
      try {
        const [invalidResponse] = await client.request({
          url: '/v3/suppression/invalid_emails',
          method: 'GET',
          qs: { start_time: startTime, end_time: endTime }
        });
        
        invalids = (invalidResponse.body || []).map(item => ({
          email: item.email,
          reason: item.reason || 'Invalid email format',
          status: 'invalid',
          bounceClassification: 'N/A',
          timestamp: new Date(item.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          createdTimestamp: item.created,
          smtpResponse: 'N/A'
        }));
      } catch (err) {
        logger.warn(`Failed to fetch invalid emails: ${err.message}`);
      }
    }

    // Fetch spam reports for context
    if (filterStatus === 'all' || filterStatus === 'spam') {
      try {
        const [spamResponse] = await client.request({
          url: '/v3/suppression/spam_reports',
          method: 'GET',
          qs: { start_time: startTime, end_time: endTime }
        });
        
        spamReports = (spamResponse.body || []).map(item => ({
          email: item.email,
          reason: 'Marked as spam by recipient',
          status: 'spam',
          bounceClassification: 'N/A',
          timestamp: new Date(item.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          createdTimestamp: item.created,
          smtpResponse: 'N/A'
        }));
      } catch (err) {
        logger.warn(`Failed to fetch spam reports: ${err.message}`);
      }
    }

    // Combine all failed emails based on filter
    let allFailedEmails = [];
    
    switch(filterStatus) {
      case 'bounce':
        allFailedEmails = bounces;
        break;
      case 'blocked':
      case 'dropped':
        allFailedEmails = blocks;
        break;
      case 'invalid':
        allFailedEmails = invalids;
        break;
      case 'spam':
        allFailedEmails = spamReports;
        break;
      default: // 'all'
        allFailedEmails = [...bounces, ...blocks, ...invalids, ...spamReports];
    }

    // Sort by timestamp (most recent first)
    allFailedEmails.sort((a, b) => b.createdTimestamp - a.createdTimestamp);

    // Group by email to find repeat failures
    const emailFailureCount = {};
    allFailedEmails.forEach(email => {
      emailFailureCount[email.email] = (emailFailureCount[email.email] || 0) + 1;
    });

    // Get repeat offenders (emails that failed multiple times)
    const repeatFailures = Object.entries(emailFailureCount)
      .filter(([email, count]) => count > 1)
      .map(([email, count]) => ({ email, failureCount: count }))
      .sort((a, b) => b.failureCount - a.failureCount);

    // Categorize by bounce reason
    const reasonCategories = {};
    allFailedEmails.forEach(email => {
      const reasonKey = email.reason.substring(0, 50); // First 50 chars as key
      if (!reasonCategories[reasonKey]) {
        reasonCategories[reasonKey] = {
          reason: email.reason,
          count: 0,
          emails: []
        };
      }
      reasonCategories[reasonKey].count++;
      if (!reasonCategories[reasonKey].emails.includes(email.email)) {
        reasonCategories[reasonKey].emails.push(email.email);
      }
    });

    const topReasons = Object.values(reasonCategories)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      status: true,
      code: 200,
      data: {
        summary: {
          totalFailedEmails: allFailedEmails.length,
          uniqueFailedEmails: Object.keys(emailFailureCount).length,
          dateRange: {
            from: startDate.toISOString().split('T')[0],
            to: endDate.toISOString().split('T')[0],
            days: days
          },
          filterApplied: filterStatus
        },
        failedEmails: allFailedEmails,
        repeatFailures,
        topFailureReasons: topReasons,
        analytics: {
          bouncedCount: bounces.length,
          blockedCount: blocks.length,
          invalidCount: invalids.length,
          spamCount: spamReports.length,
          totalByType: {
            hardBounces: bounces.length,
            softBounces: blocks.length,
            invalidEmails: invalids.length,
            spamReports: spamReports.length
          }
        },
        note: 'Using Suppression APIs (free). For detailed message history, upgrade to Email Activity Feed add-on.'
      }
    };

  } catch (error) {
    logger.error(`Error fetching failed emails: ${error.message}`);
    
    if (error.response) {
      logger.error(`SendGrid API Error get failed Email: ${JSON.stringify(error.response.body)}`);
      
      // Check for 403 Forbidden
      if (error.response.statusCode === 403) {
        return {
          status: false,
          code: 403,
          msg: 'Email Activity API requires a paid add-on. Using alternative suppression APIs instead.',
          error: error.message,
          documentation: 'https://support.sendgrid.com/hc/en-us/articles/31240221874971'
        };
      }
    }
    
    return {
      status: false,
      code: error.response?.statusCode || 500,
      msg: error.response?.body?.errors?.[0]?.message || 'Failed to fetch failed emails',
      error: error.message
    };
  }
};

module.exports = getFailedEmails;
