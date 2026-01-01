import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Infinite Rig Services <noreply@infiniterigservices.com>';
const HR_EMAIL = process.env.HR_EMAIL || 'hr@infiniterigservices.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@infiniterigservices.com';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      reply_to: replyTo,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send exception:', error);
    return { success: false, error };
  }
}

/**
 * Send application confirmation to applicant
 */
export async function sendApplicationConfirmation(
  email: string,
  applicantName: string,
  jobTitle: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35, #B8860B); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: #fff; padding: 20px; border-left: 4px solid #FF6B35; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Received</h1>
        </div>
        <div class="content">
          <p>Dear ${applicantName},</p>

          <p>Thank you for applying for the <strong>${jobTitle}</strong> position at Infinite Rig Services. We have successfully received your application.</p>

          <div class="highlight">
            <strong>What happens next?</strong>
            <ul>
              <li>Our recruitment team will review your application within 3-5 business days</li>
              <li>If your qualifications match our requirements, we will contact you for an interview</li>
              <li>You can track your application status through our careers portal</li>
            </ul>
          </div>

          <p>We appreciate your interest in joining our team. Infinite Rig Services is committed to building a world-class workforce in Liberia's offshore industry.</p>

          <p>If you have any questions, please don't hesitate to contact our HR department.</p>

          <p>Best regards,<br>
          <strong>Human Resources Team</strong><br>
          Infinite Rig Services, Inc.</p>
        </div>
        <div class="footer">
          <p>Crown Prince Plaza, Congo Town, Monrovia, Liberia</p>
          <p>Phone: +231 88 191 5322 | Email: hr@infiniterigservices.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Application Received - ${jobTitle} | Infinite Rig Services`,
    html,
  });
}

/**
 * Send new application notification to HR
 */
export async function sendHRNotification(application: {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  jobTitle: string;
  resumeUrl: string;
  coverLetter?: string;
  currentPosition?: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #004E89; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 20px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .info-table td:first-child { font-weight: bold; width: 40%; color: #004E89; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; }
        .cover-letter { background: #fff; padding: 15px; border: 1px solid #ddd; margin-top: 20px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Job Application Received</h1>
        </div>
        <div class="content">
          <p>A new application has been submitted for the <strong>${application.jobTitle}</strong> position.</p>

          <table class="info-table">
            <tr>
              <td>Applicant Name</td>
              <td>${application.applicantName}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td><a href="mailto:${application.applicantEmail}">${application.applicantEmail}</a></td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>${application.applicantPhone}</td>
            </tr>
            ${application.currentPosition ? `
            <tr>
              <td>Current Position</td>
              <td>${application.currentPosition}</td>
            </tr>
            ` : ''}
            <tr>
              <td>Resume</td>
              <td><a href="${application.resumeUrl}" class="button" style="color: white;">Download Resume</a></td>
            </tr>
          </table>

          ${application.coverLetter ? `
          <div class="cover-letter">
            <strong>Cover Letter / Additional Information:</strong>
            <p>${application.coverLetter}</p>
          </div>
          ` : ''}

          <p style="margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/applications" class="button" style="color: white;">
              View in Dashboard
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: HR_EMAIL,
    subject: `New Application: ${application.jobTitle} - ${application.applicantName}`,
    html,
    replyTo: application.applicantEmail,
  });
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(contact: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #004E89; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 20px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .info-table td:first-child { font-weight: bold; width: 30%; color: #004E89; }
        .message-box { background: #fff; padding: 20px; border: 1px solid #ddd; margin-top: 20px; border-radius: 5px; }
        .button { display: inline-block; background: #FF6B35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <table class="info-table">
            <tr>
              <td>Name</td>
              <td>${contact.name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td><a href="mailto:${contact.email}">${contact.email}</a></td>
            </tr>
            ${contact.phone ? `
            <tr>
              <td>Phone</td>
              <td>${contact.phone}</td>
            </tr>
            ` : ''}
            ${contact.company ? `
            <tr>
              <td>Company</td>
              <td>${contact.company}</td>
            </tr>
            ` : ''}
            <tr>
              <td>Subject</td>
              <td>${contact.subject}</td>
            </tr>
          </table>

          <div class="message-box">
            <strong>Message:</strong>
            <p>${contact.message}</p>
          </div>

          <p style="margin-top: 20px;">
            <a href="mailto:${contact.email}" class="button" style="color: white;">Reply to ${contact.name}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Contact Form: ${contact.subject}`,
    html,
    replyTo: contact.email,
  });
}

/**
 * Send quote request notification to admin
 */
export async function sendQuoteNotification(quote: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceArea: string;
  requirements?: string;
}) {
  const serviceLabels: Record<string, string> = {
    offshore: 'Offshore Support Services',
    manning: 'Manning & Crew Services',
    hse: 'Health, Safety & Environment',
    supply: 'Supply Chain & Logistics',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35, #B8860B); padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 20px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .service-badge { display: inline-block; background: #FF6B35; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin-bottom: 20px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table td { padding: 10px; border-bottom: 1px solid #ddd; }
        .info-table td:first-child { font-weight: bold; width: 30%; color: #004E89; }
        .requirements-box { background: #fff; padding: 20px; border: 1px solid #ddd; margin-top: 20px; border-radius: 5px; }
        .button { display: inline-block; background: #004E89; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Quote Request</h1>
        </div>
        <div class="content">
          <span class="service-badge">${serviceLabels[quote.serviceArea] || quote.serviceArea}</span>

          <table class="info-table">
            <tr>
              <td>Name</td>
              <td>${quote.name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td><a href="mailto:${quote.email}">${quote.email}</a></td>
            </tr>
            ${quote.phone ? `
            <tr>
              <td>Phone</td>
              <td>${quote.phone}</td>
            </tr>
            ` : ''}
            ${quote.company ? `
            <tr>
              <td>Company</td>
              <td>${quote.company}</td>
            </tr>
            ` : ''}
          </table>

          ${quote.requirements ? `
          <div class="requirements-box">
            <strong>Project Requirements:</strong>
            <p>${quote.requirements}</p>
          </div>
          ` : ''}

          <p style="margin-top: 20px;">
            <a href="mailto:${quote.email}" class="button" style="color: white;">Respond to Request</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Quote Request: ${serviceLabels[quote.serviceArea] || quote.serviceArea} - ${quote.name}`,
    html,
    replyTo: quote.email,
  });
}

/**
 * Send application status update to applicant
 */
export async function sendStatusUpdateEmail(
  email: string,
  applicantName: string,
  jobTitle: string,
  newStatus: string,
  message?: string
) {
  const statusMessages: Record<string, { title: string; description: string; color: string }> = {
    reviewing: {
      title: 'Application Under Review',
      description: 'Our team is currently reviewing your application.',
      color: '#3B82F6',
    },
    shortlisted: {
      title: 'Congratulations! You\'ve Been Shortlisted',
      description: 'Your application has been shortlisted for the next stage.',
      color: '#10B981',
    },
    interview_scheduled: {
      title: 'Interview Scheduled',
      description: 'We would like to invite you for an interview.',
      color: '#8B5CF6',
    },
    interview_completed: {
      title: 'Interview Completed',
      description: 'Thank you for attending the interview. We will be in touch soon.',
      color: '#6366F1',
    },
    offer_extended: {
      title: 'Job Offer Extended',
      description: 'Congratulations! We are pleased to extend you a job offer.',
      color: '#059669',
    },
    accepted: {
      title: 'Welcome to the Team!',
      description: 'Your acceptance has been confirmed. Welcome to Infinite Rig Services!',
      color: '#059669',
    },
    rejected: {
      title: 'Application Update',
      description: 'After careful consideration, we have decided to move forward with other candidates.',
      color: '#6B7280',
    },
  };

  const status = statusMessages[newStatus] || {
    title: 'Application Status Update',
    description: 'Your application status has been updated.',
    color: '#FF6B35',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${status.color}; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-box { background: #fff; padding: 20px; border-left: 4px solid ${status.color}; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${status.title}</h1>
        </div>
        <div class="content">
          <p>Dear ${applicantName},</p>

          <p>We have an update regarding your application for the <strong>${jobTitle}</strong> position at Infinite Rig Services.</p>

          <div class="status-box">
            <p>${status.description}</p>
            ${message ? `<p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">${message}</p>` : ''}
          </div>

          <p>If you have any questions, please don't hesitate to contact our HR department.</p>

          <p>Best regards,<br>
          <strong>Human Resources Team</strong><br>
          Infinite Rig Services, Inc.</p>
        </div>
        <div class="footer">
          <p>Crown Prince Plaza, Congo Town, Monrovia, Liberia</p>
          <p>Phone: +231 88 191 5322 | Email: hr@infiniterigservices.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `${status.title} - ${jobTitle} | Infinite Rig Services`,
    html,
  });
}
