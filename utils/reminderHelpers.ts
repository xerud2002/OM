import emailjs from "emailjs-com";

/**
 * Trimite reminder email pentru upload media
 */
export async function sendUploadReminder(
  customerEmail: string,
  customerName: string,
  uploadLink: string
): Promise<boolean> {
  try {
    const emailParams = {
      to_email: customerEmail,
      to_name: customerName,
      upload_link: uploadLink,
      reminder: true, // Flag pentru template diferit (opțional)
    };

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, // Sau un template special pentru reminders
      emailParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );

    return true;
  } catch (error) {
    console.error("Failed to send reminder email:", error);
    return false;
  }
}

/**
 * Verifică și trimite toate reminder-urile necesare
 * Poate fi apelat manual sau dintr-un cron job client-side
 */
export async function checkAndSendReminders(): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  try {
    const resp = await fetch("/api/sendUploadReminders");
    const data = await resp.json();

    if (!data.ok || !data.reminders) {
      console.error("Failed to fetch reminders:", data.error);
      return { sent, failed };
    }

    // Send emails one by one
    for (const reminder of data.reminders) {
      const success = await sendUploadReminder(reminder.email, reminder.name, reminder.link);

      if (success) {
        sent++;
        // Mark reminder as sent in Firestore (optional - add update call here)
      } else {
        failed++;
      }

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error("Error in checkAndSendReminders:", error);
  }

  return { sent, failed };
}
