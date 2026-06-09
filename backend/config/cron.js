const cron = require('node-cron');

/**
 * Starts a scheduled cron job that runs at 9:00 AM IST (Asia/Kolkata) every day.
 *
 * @param {Function} callback - The async function to execute on each cron tick.
 *                              Typically this will be the email-sending batch function.
 */
const startCronJob = (callback) => {
  // Cron expression: '0 9 * * *'
  // Breakdown: minute=0, hour=9, day=*, month=*, weekday=*
  // Runs every day at exactly 09:00 AM in the Asia/Kolkata (IST) timezone
  cron.schedule(
    '0 9 * * *',
    async () => {
      const timestamp = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });

      console.log(`[CRON] Job triggered at: ${timestamp} IST`);

      try {
        // Execute the provided callback (e.g., batch email sending logic)
        await callback();
        console.log(`[CRON] Job completed successfully at: ${timestamp} IST`);
      } catch (error) {
        // Log any errors that occur during callback execution
        console.error(`[CRON] Job failed at: ${timestamp} IST. Error:`, error.message);
      }
    },
    {
      // Set timezone to Indian Standard Time
      timezone: 'Asia/Kolkata',
    }
  );

  console.log('[CRON] Daily email scheduler registered — runs at 9:00 AM IST');
};

module.exports = { startCronJob };
