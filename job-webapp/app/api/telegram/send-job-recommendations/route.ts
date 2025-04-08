import { database } from "@/db/config/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Helper function to send Telegram messages (reusing existing code)
async function sendTelegramMessage(chatId: string | number, text: string) {
  console.log(`Sending job recommendation to chat ID ${chatId}`);
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable');
  }
  
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: false
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Telegram API error: ${errorData.description || response.statusText}`);
  }
  
  return await response.json();
}

// Helper function to format job information
function formatJobMessage(job: any): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  
  return `
<b>🔍 New Job Recommendation</b>
  
<b>${job.name}</b>
<i>${job.company.name} · ${job.location}</i>

💼 ${job.category}
💰 ${job.salary}
  
${job.excerpt}

<b>Tags:</b> ${job.tags.join(', ')}

👉 <a href="${appUrl}/jobs/${job.slug}">View Job Details</a>
`.trim();
}

// Helper function to check if user has interacted with a job
async function hasUserInteractedWithJob(userId: ObjectId, jobId: ObjectId) {
  const profilesCollection = database.collection("profiles");
  const bookmarkCollection = database.collection("bookmark");
  
  try {
    // Check profile for applied or saved jobs
    const profile = await profilesCollection.findOne({
      userId: userId,
      $or: [
        { appliedJobs: jobId.toString() },
        { savedJobs: jobId.toString() }
      ]
    });
    
    if (profile) {
      return true;
    }
    
    // Check bookmarks collection
    const bookmark = await bookmarkCollection.findOne({
      userId: userId.toString(),
      jobId: jobId.toString()
    });
    
    return !!bookmark;
  } catch (error) {
    console.error(`Error checking job interaction for user ${userId} and job ${jobId}:`, error);
    // If there's an error, assume no interaction to avoid missing recommendations
    return false;
  }
}

// Helper function to mark job as saved for a user
async function markJobAsRecommended(userId: ObjectId, jobId: ObjectId) {
  const profilesCollection = database.collection("profiles");
  
  try {
    // Add job to savedJobs array to prevent future notifications
    const result = await profilesCollection.updateOne(
      { userId: userId },
      { $addToSet: { savedJobs: jobId.toString() } }
    );
    
    return result.matchedCount > 0;
  } catch (error) {
    console.error(`Error marking job ${jobId} as recommended for user ${userId}:`, error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // Check for API key when called from CRON service
    const apiKey = req.headers.get('x-api-key');
    const cronApiKey = process.env.CRON_API_KEY;
    
    // If request has an API key, validate it
    if (apiKey) {
      if (!cronApiKey || apiKey !== cronApiKey) {
        return NextResponse.json(
          { error: "Invalid API key" },
          { status: 401 }
        );
      }
      console.log("CRON job authenticated successfully with API key");
    } 
    // Otherwise rely on middleware auth for manual runs
    else {
      console.log("Starting job recommendation distribution");
      const results = {
        users: 0,
        usersWithTelegram: 0,
        messagesSent: 0,
        errors: 0,
        jobsFound: 0,
        filteredDuplicates: 0,
        alreadyInteracted: 0,
      };

      // 1. Find all users with verified Telegram IDs and their profile tags
      const usersCollection = database.collection("User");
      const profilesCollection = database.collection("profiles");
      const jobsCollection = database.collection("jobs");
      
      // Get all users with telegram IDs
      const users = await usersCollection.find({ 
        telegramId: { $exists: true, $ne: "" },
        telegramVerified: true
      }).toArray();
      
      results.users = users.length;
      results.usersWithTelegram = users.length;
      console.log(`Found ${users.length} users with Telegram IDs`);
      
      // Get all jobs (we'll filter them for each user based on tags)
      const allJobs = await jobsCollection.find({}).toArray();
      console.log(`Found ${allJobs.length} total jobs`);
      
      // Process each user
      for (const user of users) {
        try {
          console.log(`Processing user ${user.name} (${user._id})`);
          const userId = new ObjectId(user._id);
          
          // Get user profile to access tags
          const profile = await profilesCollection.findOne({ userId });
          
          if (!profile || !profile.tags || profile.tags.length === 0) {
            console.log(`User ${user._id} has no profile tags, skipping`);
            continue;
          }
          
          const userTags = profile.tags;
          console.log(`User ${user._id} has tags: ${userTags.join(', ')}`);
          
          // Find matching jobs for this user based on tags
          const matchingJobs = allJobs.filter(job => 
            job.tags && job.tags.some(jobTag => userTags.includes(jobTag))
          );
          
          console.log(`Found ${matchingJobs.length} matching jobs for user ${user._id}`);
          results.jobsFound += matchingJobs.length;
          
          if (matchingJobs.length === 0) continue;
          
          // Filter out jobs the user has already interacted with
          const newJobs = [];
          for (const job of matchingJobs) {
            const jobId = new ObjectId(job._id);
            const hasInteracted = await hasUserInteractedWithJob(userId, jobId);
            
            if (hasInteracted) {
              console.log(`User ${user._id} has already interacted with job ${job._id}, skipping`);
              results.alreadyInteracted++;
            } else {
              newJobs.push(job);
            }
          }
          
          results.filteredDuplicates += (matchingJobs.length - newJobs.length);
          
          if (newJobs.length === 0) {
            console.log(`No new jobs to recommend for user ${user._id}`);
            continue;
          }
          
          // Limit to top 3 most recent jobs to avoid spam
          const recentJobs = newJobs
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
          
          // Send a telegram message for each matching job
          for (const job of recentJobs) {
            try {
              const jobId = new ObjectId(job._id);
              const message = formatJobMessage(job);
              await sendTelegramMessage(user.telegramId, message);
              results.messagesSent++;
              
              // Mark job as recommended so we don't send it again
              await markJobAsRecommended(userId, jobId);
              
              // Add a small delay to avoid hitting Telegram API rate limits
              await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
              console.error(`Failed to send job notification for job ${job._id} to user ${user._id}:`, error);
              results.errors++;
            }
          }
        } catch (userError) {
          console.error(`Error processing user ${user._id}:`, userError);
          results.errors++;
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        results,
        message: `Sent ${results.messagesSent} job recommendations to ${results.usersWithTelegram} users. Filtered ${results.filteredDuplicates} duplicates.`
      });
    }
  } catch (error) {
    console.error("Error sending job recommendations:", error);
    return NextResponse.json(
      { error: "Failed to send job recommendations", details: error.message },
      { status: 500 }
    );
  }
}