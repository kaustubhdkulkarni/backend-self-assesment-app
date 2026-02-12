const { CronJob } = require("cron");
const logger = require("../config/logger");

const { addOrUpdateCurrencyRates } = require("../modules/currencies/services");
const { checkCampaignTargetRaised } = require("../modules/campaigns/services");
const { updateRepaymentDueDate } = require("../modules/campaigns/services");
const { deleteExpiredTransactions } = require("../modules/transactions/services");
const {
  updateTotalAmount,
  updateLateFeeAmount,
} = require("../modules/fundraiserRepayments/services");
const updateInvestmentStatus = require("../modules/investments/services/updateInvestmentStatus");
const { resetLoginAttempts } = require("../modules/users/services");

// DAILY – Currency rates
new CronJob("0 0 * * *", async () => {
  logger.info("[CRON] Updating currency rates");
  await addOrUpdateCurrencyRates();
}).start();

// Every 15 min – Campaign status
new CronJob("*/15 * * * *", async () => {
  logger.info("[CRON] Updating campaign status");
  await checkCampaignTargetRaised();
}).start();

// Every hour – Delete expired transactions
new CronJob("0 * * * *", async () => {
  logger.info("[CRON] Deleting expired transactions");
  await deleteExpiredTransactions();
}).start();

// Every 10 min – Repayment date
new CronJob("*/10 * * * *", async () => {
  logger.info("[CRON] Updating repayment due dates");
  await updateRepaymentDueDate();
}).start();

// Every 10 min – Total amount
new CronJob("*/10 * * * *", async () => {
  logger.info("[CRON] Updating total amount");
  await updateTotalAmount();
}).start();

// Every 15 min – Late fee
new CronJob("*/15 * * * *", async () => {
  logger.info("[CRON] Updating late fee");
  await updateLateFeeAmount();
}).start();

// Every 15 min – Investment status
new CronJob("*/15 * * * *", async () => {
  logger.info("[CRON] Updating investment status");
  await updateInvestmentStatus();
}).start();

// Midnight – Reset login attempts
new CronJob("0 0 * * *", async () => {
  logger.info("[CRON] Resetting login attempts");
  await resetLoginAttempts();
}).start();

logger.info("✅ Cron worker started");
