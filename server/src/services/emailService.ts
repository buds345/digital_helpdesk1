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

  // Calculate deadline based on priority
  private calculateDeadline(priority: string): { deadline: Date; deadlineText: string; urgencyHours: number } {
    const now = new Date();
    let urgencyHours = 24; // default

    switch (priority.toLowerCase()) {
      case 'critical':
        urgencyHours = 2;
        break;
      case 'high':
        urgencyHours = 8;
        break;
      case 'medium':
        urgencyHours = 24;
        break;
      case 'low':
        urgencyHours = 72;
        break;
      default:
        urgencyHours = 24;
    }

    const deadline = new Date(now.getTime() + (urgencyHours * 60 * 60 * 1000));
    const deadlineText = this.formatDeadline(deadline, urgencyHours);

    return { deadline, deadlineText, urgencyHours };
  }

  private formatDeadline(deadline: Date, hours: number): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };

    if (hours < 24) {
      return `${deadline.toLocaleDateString('en-US', options)} (${hours} hours from now)`;
    } else {
      const days = Math.floor(hours / 24);
      return `${deadline.toLocaleDateString('en-US', options)} (${days} ${days === 1 ? 'day' : 'days'} from now)`;
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
    const deadlineInfo = this.calculateDeadline(priority);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: `🎫 New ${priority.toUpperCase()} Priority Ticket Assigned: #${ticketId} - ${ticketTitle}`,
      html: this.getTicketAssignmentTemplate(
        staffName,
        ticketId,
        ticketTitle,
        ticketDescription,
        priority,
        clientName,
        dashboardUrl,
        deadlineInfo
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
      case 'critical':
        return '#d32f2f'; // Dark Red
      case 'high':
        return '#f44336'; // Red
      case 'medium':
        return '#ff9800'; // Orange
      case 'low':
        return '#4caf50'; // Green
      default:
        return '#2196f3'; // Blue
    }
  }

  private getPriorityIcon(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'critical':
        return '🚨';
      case 'high':
        return '🔥';
      case 'medium':
        return '⚡';
      case 'low':
        return '📝';
      default:
        return '🎫';
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
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f0f2f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            border-radius: 12px 12px 0 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
          .content { 
            padding: 40px 30px; 
            background: white; 
            border-radius: 0 0 12px 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 30px; 
            margin: 25px 0;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: transform 0.2s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }
          .button:hover { transform: translateY(-2px); }
          .warning-box {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border: 1px solid #f6c343;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            color: #856404;
          }
          .link-box {
            word-break: break-all; 
            color: #667eea; 
            background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%); 
            padding: 15px; 
            border-radius: 8px;
            border-left: 4px solid #667eea;
            font-family: 'Courier New', monospace;
            font-size: 14px;
          }
          .footer { 
            padding: 25px; 
            text-align: center; 
            color: #666; 
            font-size: 14px;
            background: white;
            margin-top: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          .icon { font-size: 48px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">🔐</div>
            <h1>Password Reset Request</h1>
            <p>We received a request to reset your password</p>
          </div>
          
          <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}! 👋</h2>
            <p style="font-size: 16px; margin-bottom: 20px;">We received a request to reset your password for your SM Solutions account.</p>
            <p style="font-size: 16px; margin-bottom: 30px;">If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${resetLink}" class="button">🔑 Reset My Password</a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 15px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
            <div class="link-box">${resetLink}</div>
            
            <div class="warning-box">
              <strong>⚠️ Important Security Information:</strong>
              <ul style="margin: 15px 0 0 0; padding-left: 20px;">
                <li>This password reset link will expire in <strong>1 hour</strong></li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Your password will remain unchanged if you don't click the link</li>
                <li>For security reasons, this link can only be used once</li>
              </ul>
            </div>
            
            <p style="margin-top: 30px;">If you continue to have problems, please contact our support team.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>SM Solutions Team</strong> 💙</p>
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
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f0f2f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            border-radius: 12px 12px 0 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .content { 
            padding: 40px 30px; 
            background: white; 
            border-radius: 0 0 12px 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
            color: white; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 30px; 
            margin: 25px 0;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
          }
          .link-box {
            word-break: break-all; 
            color: #4CAF50; 
            background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%); 
            padding: 15px; 
            border-radius: 8px;
            border-left: 4px solid #4CAF50;
            font-family: 'Courier New', monospace;
            font-size: 14px;
          }
          .footer { 
            padding: 25px; 
            text-align: center; 
            color: #666; 
            font-size: 14px;
            background: white;
            margin-top: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          .icon { font-size: 48px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">📧</div>
            <h1>Email Verification</h1>
            <p>Complete your registration with SM Solutions</p>
          </div>
          <div class="content">
            <h2>Hi ${name}! 👋</h2>
            <p>Thank you for registering with SM Solutions. To complete your registration, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">✅ Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <div class="link-box">${verificationUrl}</div>
            <p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #f6c343;"><strong>⏰ This link will expire in 24 hours.</strong></p>
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
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f0f2f5; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            border-radius: 12px 12px 0 0;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .content { 
            padding: 40px 30px; 
            background: white; 
            border-radius: 0 0 12px 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          .feature-list {
            background: linear-gradient(135deg, #f8f9ff 0%, #e8f5e8 100%);
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
          }
          .feature-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            font-size: 16px;
          }
          .feature-icon { font-size: 24px; margin-right: 15px; }
          .footer { 
            padding: 25px; 
            text-align: center; 
            color: #666; 
            font-size: 14px;
            background: white;
            margin-top: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          .icon { font-size: 48px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">🎉</div>
            <h1>Welcome to SM Solutions!</h1>
            <p>Your journey begins now</p>
          </div>
          <div class="content">
            <h2>Hi ${name}! 🎊</h2>
            <p style="font-size: 18px; margin-bottom: 25px;">Your email has been successfully verified and your account is now active. Welcome to the SM Solutions family!</p>
            
            <div class="feature-list">
              <h3 style="margin-top: 0; color: #333;">You can now access:</h3>
              <div class="feature-item">
                <span class="feature-icon">🎫</span>
                <span>Create and track support tickets</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">⚡</span>
                <span>Access all our premium services</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">👥</span>
                <span>Get help from our expert support team</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>View detailed analytics and reports</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🔔</span>
                <span>Receive real-time notifications</span>
              </div>
            </div>
            
            <p style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #2196F3;">
              <strong>💡 Pro Tip:</strong> Bookmark our dashboard and enable notifications to stay updated on your tickets and account activity.
            </p>
            
            <p>If you have any questions or need assistance getting started, feel free to contact our support team. We're here to help!</p>
            <p style="font-size: 18px; margin-top: 30px;">Welcome aboard! 🚀</p>
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
    dashboardUrl: string,
    deadlineInfo: { deadline: Date; deadlineText: string; urgencyHours: number }
  ): string {
    const priorityColor = this.getPriorityColor(priority);
    const priorityIcon = this.getPriorityIcon(priority);
    const isUrgent = priority.toLowerCase() === 'critical' || priority.toLowerCase() === 'high';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Ticket Assigned</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f0f2f5; 
          }
          .container { 
            max-width: 700px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            background: linear-gradient(135deg, ${priorityColor} 0%, ${priorityColor}dd 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            border-radius: 12px 12px 0 0;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="80" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="60" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            border-radius: 12px 12px 0 0;
          }
          .header-content { position: relative; z-index: 1; }
          .priority-icon { font-size: 56px; margin-bottom: 15px; display: block; }
          .header h1 { margin: 0; font-size: 32px; font-weight: 600; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
          .header p { margin: 10px 0 0 0; opacity: 0.95; font-size: 18px; }
          
          .content { 
            padding: 0; 
            background: white; 
            border-radius: 0 0 12px 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            overflow: hidden;
          }
          
          .greeting-section {
            padding: 30px;
            background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
          }
          
          .ticket-overview {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
          }
          
          .ticket-detail-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            border-left: 4px solid ${priorityColor};
          }
          
          .ticket-main-info {
            padding: 30px;
            background: white;
          }
          
          .priority-badge {
            display: inline-flex;
            align-items: center;
            background: ${priorityColor};
            color: white;
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 20px;
            box-shadow: 0 3px 10px ${priorityColor}40;
          }
          
          .deadline-section {
            background: ${isUrgent ? 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)' : 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)'};
            border: 1px solid ${isUrgent ? '#f6c343' : '#4caf50'};
            padding: 25px;
            border-radius: 12px;
            margin: 25px 30px;
            text-align: center;
            position: relative;
          }
          
          .deadline-icon {
            font-size: 36px;
            margin-bottom: 10px;
            display: block;
          }
          
          .deadline-text {
            font-size: 18px;
            font-weight: 600;
            color: ${isUrgent ? '#856404' : '#2e7d32'};
            margin-bottom: 8px;
          }
          
          .deadline-detail {
            font-size: 14px;
            color: ${isUrgent ? '#856404' : '#2e7d32'};
            opacity: 0.8;
          }
          
          .description-box {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            white-space: pre-wrap;
            font-family: 'Segoe UI', system-ui, sans-serif;
            line-height: 1.6;
          }
          
          .button-section {
            padding: 30px;
            text-align: center;
            background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
          }
          
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, ${priorityColor} 0%, ${priorityColor}dd 100%);
            color: white; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 30px; 
            margin: 10px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px ${priorityColor}40;
          }
          
          .button:hover { 
            transform: translateY(-3px); 
            box-shadow: 0 8px 25px ${priorityColor}60;
          }
          
          .next-steps {
            padding: 30px;
            background: white;
          }
          
          .step-item {
            display: flex;
            align-items: flex-start;
            margin: 15px 0;
            padding: 15px;
            background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
            border-radius: 8px;
            border-left: 3px solid ${priorityColor};
          }
          
          .step-number {
            background: ${priorityColor};
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            margin-right: 15px;
            flex-shrink: 0;
          }
          
          .urgent-banner {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 15px 30px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          
          .info-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid ${priorityColor};
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          }
          
          .info-label {
            font-size: 12px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          
          .info-value {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
          
          .footer { 
            padding: 30px; 
            text-align: center; 
            color: #666; 
            font-size: 14px;
            background: white;
            margin-top: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }
          
          @media (max-width: 600px) {
            .ticket-overview { grid-template-columns: 1fr; }
            .container { padding: 10px; }
            .header, .content { border-radius: 8px; }
            .header { padding: 30px 20px; }
            .greeting-section, .ticket-main-info, .next-steps { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${isUrgent ? '<div class="urgent-banner">🚨 URGENT TICKET REQUIRES IMMEDIATE ATTENTION 🚨</div>' : ''}
          
          <div class="header">
            <div class="header-content">
              <span class="priority-icon">${priorityIcon}</span>
              <h1>New Ticket Assigned</h1>
              <p>A ${priority.toLowerCase()} priority ticket needs your expertise</p>
            </div>
          </div>
          
          <div class="content">
            <div class="greeting-section">
              <h2 style="margin-top: 0; color: #333; font-size: 24px;">Hi ${staffName}! 👋</h2>
              <p style="font-size: 16px; margin-bottom: 0;">A new ticket has been assigned to you and requires your attention. Here are the complete details:</p>
            </div>
            
            <div class="ticket-overview">
              <div class="ticket-detail-card">
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Ticket ID</div>
                    <div class="info-value">#${ticketId}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Client</div>
                    <div class="info-value">${clientName}</div>
                  </div>
                </div>
              </div>
              
              <div class="ticket-detail-card">
                <div class="priority-badge">
                  ${priorityIcon} ${priority.toUpperCase()} PRIORITY
                </div>
                <div style="color: ${priorityColor}; font-weight: 600; font-size: 14px;">
                  Response required within ${deadlineInfo.urgencyHours} ${deadlineInfo.urgencyHours === 1 ? 'hour' : 'hours'}
                </div>
              </div>
            </div>
            
            <div class="deadline-section">
              <span class="deadline-icon">${isUrgent ? '⏰' : '📅'}</span>
              <div class="deadline-text">
                ${isUrgent ? 'URGENT DEADLINE' : 'Response Deadline'}
              </div>
              <div class="deadline-detail">${deadlineInfo.deadlineText}</div>
              ${isUrgent ? '<div style="margin-top: 10px; font-weight: bold; color: #d32f2f;">⚡ Immediate action required!</div>' : ''}
            </div>
            
            <div class="ticket-main-info">
              <h3 style="color: #333; margin-top: 0; font-size: 20px; margin-bottom: 15px;">📋 Ticket Details</h3>
              
              <div style="margin-bottom: 20px;">
                <div class="info-label">Title</div>
                <div style="font-size: 18px; font-weight: 600; color: #333; margin-top: 5px;">${ticketTitle}</div>
              </div>
              
              <div style="margin-bottom: 20px;">
                <div class="info-label">Description</div>
                <div class="description-box">${ticketDescription}</div>
              </div>
            </div>
            
            <div class="button-section">
              <a href="${dashboardUrl}" class="button">
                🎯 View Ticket in Dashboard
              </a>
              <a href="${process.env.FRONTEND_URL || process.env.CLIENT_URL}/tickets" class="button" style="background: linear-gradient(135deg, #666 0%, #999 100%); box-shadow: 0 4px 15px rgba(102,102,102,0.4);">
                📊 View All Tickets
              </a>
            </div>
            
            <div class="next-steps">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 25px; font-size: 20px;">🚀 Next Steps</h3>
              
              <div class="step-item">
                <span class="step-number">1</span>
                <div>
                  <strong>Review ticket details</strong><br>
                  <span style="color: #666;">Carefully examine the client's issue and any attached files or screenshots</span>
                </div>
              </div>
              
              <div class="step-item">
                <span class="step-number">2</span>
                <div>
                  <strong>Contact client if needed</strong><br>
                  <span style="color: #666;">Reach out for clarification or additional information if the issue isn't clear</span>
                </div>
              </div>
              
              <div class="step-item">
                <span class="step-number">3</span>
                <div>
                  <strong>Update ticket status</strong><br>
                  <span style="color: #666;">Keep the client informed by updating the ticket status as you progress</span>
                </div>
              </div>
              
              <div class="step-item">
                <span class="step-number">4</span>
                <div>
                  <strong>Document your solution</strong><br>
                  <span style="color: #666;">Record your resolution steps for future reference and knowledge sharing</span>
                </div>
              </div>
              
              ${isUrgent ? `
              <div style="background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%); border: 1px solid #f8bbd9; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
                <strong style="color: #d32f2f;">⚠️ High Priority Reminder</strong><br>
                <span style="color: #d32f2f;">This ${priority.toLowerCase()} priority ticket requires immediate attention. Please begin work as soon as possible and provide regular updates.</span>
              </div>
              ` : ''}
            </div>
            
            <div style="padding: 30px; background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%); border-top: 1px solid #eee;">
              <p style="margin: 0; text-align: center; color: #666;">
                💡 <strong>Need Help?</strong> If you have any questions about this assignment or need additional resources, please contact your administrator or team lead.
              </p>
            </div>
            
            <div style="padding: 30px; text-align: center; background: white;">
              <p style="margin-bottom: 5px;">Best regards,</p>
              <p style="margin: 0; font-weight: bold; color: #333; font-size: 16px;">SM Solutions Team 💙</p>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px 0; font-weight: 600;">&copy; 2025 SM Solutions. All rights reserved.</p>
            <p style="margin: 0;">This is an automated notification. Please do not reply to this email.</p>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              <p style="margin: 0;">🔔 You're receiving this because you've been assigned to ticket #${ticketId}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();