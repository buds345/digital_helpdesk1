import nodemailer from 'nodemailer';
import crypto from 'crypto';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure your email transporter
    this.transporter = nodemailer.createTransport({
      // For Gmail (you can change this based on your email provider)
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your app password
      },
      // For other providers, use SMTP settings:
      // host: process.env.SMTP_HOST,
      // port: Number(process.env.SMTP_PORT),
      // secure: false,
      // auth: {
      //   user: process.env.SMTP_USER,
      //   pass: process.env.SMTP_PASSWORD,
      // },
    });
  }

  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async testEmailConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL || process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - SM Solutions',
      html: this.getPasswordResetTemplate(name, resetLink),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationToken: string
  ): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - SM Solutions',
      html: this.getVerificationEmailTemplate(name, verificationUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to SM Solutions!',
      html: this.getWelcomeEmailTemplate(name),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendTicketAssignmentEmail(
    email: string,
    staffName: string,
    ticketId: string,
    ticketTitle: string,
    ticketDescription: string,
    priority: string,
    clientName: string
  ): Promise<void> {
    const dashboardUrl = `${process.env.FRONTEND_URL || process.env.CLIENT_URL}/tickets/${ticketId}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: `New Ticket Assigned: #${ticketId} - ${ticketTitle}`,
      html: this.getTicketAssignmentTemplate(
        staffName,
        ticketId,
        ticketTitle,
        ticketDescription,
        priority,
        clientName,
        dashboardUrl
      ),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Ticket assignment email sent to ${email}`);
    } catch (error) {
      console.error('Error sending ticket assignment email:', error);
      throw new Error('Failed to send ticket assignment email');
    }
  }

  private getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return '#f44336'; // Red
      case 'medium':
        return '#ff9800'; // Orange
      case 'low':
        return '#4caf50'; // Green
      default:
        return '#2196f3'; // Blue
    }
  }

  private getPasswordResetTemplate(name: string, resetLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
          .header { 
            background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
            border-radius: 8px 8px 0 0;
          }
          .content { 
            padding: 30px; 
            background: white; 
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
            color: white; 
            padding: 14px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
          }
          .warning-box {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            color: #856404;
          }
          .footer { 
            padding: 20px; 
            text-align: center; 
            color: #666; 
            font-size: 12px;
            background: #f8f9fa;
            margin-top: 20px;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
            <p style="margin: 0; opacity: 0.9;">We received a request to reset your password</p>
          </div>
          
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>We received a request to reset your password for your SM Solutions account.</p>
            <p>If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="button">Reset My Password</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #1976d2; background: #f0f8ff; padding: 10px; border-radius: 4px;">${resetLink}</p>
            
            <div class="warning-box">
              <strong>Important Security Information:</strong>
              <ul style="margin: 10px 0 0 0;">
                <li>This password reset link will expire in <strong>1 hour</strong></li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Your password will remain unchanged if you don't click the link</li>
              </ul>
            </div>
            
            <p>If you continue to have problems, please contact our support team.</p>
            
            <p>Best regards,<br><strong>SM Solutions Team</strong></p>
          </div>
          
          <div class="footer">
            <p>&copy; 2025 SM Solutions. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getVerificationEmailTemplate(name: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .button { 
            display: inline-block; 
            background: #2196F3; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
          }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SM Solutions</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Thank you for registering with SM Solutions. To complete your registration, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2196F3;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 SM Solutions. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SM Solutions</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SM Solutions!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Your email has been successfully verified and your account is now active.</p>
            <p>You can now:</p>
            <ul>
              <li>Create and track support tickets</li>
              <li>Access our services</li>
              <li>Get help from our support team</li>
            </ul>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Welcome aboard!</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 SM Solutions. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getTicketAssignmentTemplate(
    staffName: string,
    ticketId: string,
    ticketTitle: string,
    ticketDescription: string,
    priority: string,
    clientName: string,
    dashboardUrl: string
  ): string {
    const priorityColor = this.getPriorityColor(priority);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Ticket Assigned</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
            border-radius: 8px 8px 0 0;
          }
          .content { 
            padding: 30px; 
            background: white; 
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .ticket-info {
            background: #f8f9fa;
            border-left: 4px solid ${priorityColor};
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .priority-badge {
            display: inline-block;
            background: ${priorityColor};
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 14px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
          }
          .description-box {
            background: #fff;
            border: 1px solid #e0e0e0;
            padding: 15px;
            border-radius: 4px;
            margin: 10px 0;
            white-space: pre-wrap;
          }
          .footer { 
            padding: 20px; 
            text-align: center; 
            color: #666; 
            font-size: 12px;
            background: #f8f9fa;
            margin-top: 20px;
            border-radius: 8px;
          }
          .urgent-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Ticket Assigned</h1>
            <p style="margin: 0; opacity: 0.9;">You have been assigned a new support ticket</p>
          </div>
          
          <div class="content">
            <h2>Hi ${staffName}!</h2>
            <p>A new ticket has been assigned to you. Here are the details:</p>
            
            <div class="ticket-info">
              <div class="priority-badge">${priority.toUpperCase()} PRIORITY</div>
              
              <p><strong>Ticket ID:</strong> #${ticketId}</p>
              <p><strong>Title:</strong> ${ticketTitle}</p>
              <p><strong>Client:</strong> ${clientName}</p>
              <p><strong>Priority:</strong> <span style="color: ${priorityColor}; font-weight: bold;">${priority.charAt(0).toUpperCase() + priority.slice(1)}</span></p>
              
              <p><strong>Description:</strong></p>
              <div class="description-box">${ticketDescription}</div>
            </div>

            ${priority.toLowerCase() === 'high' || priority.toLowerCase() === 'critical' ? `
            <div class="urgent-notice">
              <strong>High Priority Ticket</strong><br>
              This ticket requires immediate attention. Please review and respond as soon as possible.
            </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" class="button">View Ticket in Dashboard</a>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Review the ticket details carefully</li>
              <li>Contact the client if you need additional information</li>
              <li>Update the ticket status as you progress</li>
              <li>Document your solution for future reference</li>
            </ul>
            
            <p>If you have any questions about this assignment, please contact your administrator.</p>
            
            <p>Best regards,<br><strong>SM Solutions Team</strong></p>
          </div>
          
          <div class="footer">
            <p>&copy; 2025 SM Solutions. All rights reserved.</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();