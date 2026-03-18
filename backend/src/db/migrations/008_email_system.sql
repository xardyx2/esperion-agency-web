-- Email System Migration
-- Creates tables for email settings, email logs (delivery tracking), and email templates

-- Email Settings Table
-- Stores configuration for email providers (SMTP, SendGrid, Mailgun, SES, Postmark, SMTP2GO)
DEFINE TABLE email_settings SCHEMAFULL;
DEFINE FIELD provider ON email_settings TYPE string ASSERT $value IN ['smtp', 'sendgrid', 'mailgun', 'ses', 'postmark', 'smtp2go'];
DEFINE FIELD smtp_host ON email_settings TYPE option<string>;
DEFINE FIELD smtp_port ON email_settings TYPE option<number>;
DEFINE FIELD smtp_username ON email_settings TYPE option<string>;
DEFINE FIELD smtp_encryption ON email_settings TYPE option<string> ASSERT $value IN ['ssl', 'tls', 'starttls', null];
DEFINE FIELD api_key ON email_settings TYPE option<string>;
DEFINE FIELD from_address ON email_settings TYPE string;
DEFINE FIELD domain ON email_settings TYPE option<string>;
DEFINE FIELD region ON email_settings TYPE option<string>;
DEFINE FIELD access_key_id ON email_settings TYPE option<string>;
DEFINE FIELD secret_access_key ON email_settings TYPE option<string>;
DEFINE FIELD is_active ON email_settings TYPE bool DEFAULT true;
DEFINE FIELD created_at ON email_settings TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON email_settings TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_provider ON email_settings FIELDS provider;

-- Email Templates Table
-- Stores HTML email templates with variable substitution
DEFINE TABLE email_templates SCHEMAFULL;
DEFINE FIELD name ON email_templates TYPE string;
DEFINE FIELD slug ON email_templates TYPE string;
DEFINE FIELD subject ON email_templates TYPE string;
DEFINE FIELD body_plain ON email_templates TYPE string;
DEFINE FIELD body_html ON email_templates TYPE option<string>;
DEFINE FIELD variables ON email_templates TYPE array<string> DEFAULT [];
DEFINE FIELD category ON email_templates TYPE string DEFAULT 'general';
DEFINE FIELD is_active ON email_templates TYPE bool DEFAULT true;
DEFINE FIELD created_at ON email_templates TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON email_templates TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_slug ON email_templates FIELDS slug UNIQUE;
DEFINE INDEX idx_category ON email_templates FIELDS category;

-- Email Logs Table
-- Tracks email delivery status for monitoring and debugging
DEFINE TABLE email_logs SCHEMAFULL;
DEFINE FIELD message_id ON email_logs TYPE option<string>;
DEFINE FIELD template_id ON email_logs TYPE option<recordId>;
DEFINE FIELD template_name ON email_logs TYPE option<string>;
DEFINE FIELD to_address ON email_logs TYPE string;
DEFINE FIELD from_address ON email_logs TYPE string;
DEFINE FIELD subject ON email_logs TYPE string;
DEFINE FIELD status ON email_logs TYPE string ASSERT $value IN ['pending', 'sent', 'delivered', 'failed', 'bounced', 'complained'];
DEFINE FIELD provider ON email_logs TYPE string;
DEFINE FIELD provider_response ON email_logs TYPE option<string>;
DEFINE FIELD error_message ON email_logs TYPE option<string>;
DEFINE FIELD sent_at ON email_logs TYPE option<datetime>;
DEFINE FIELD delivered_at ON email_logs TYPE option<datetime>;
DEFINE FIELD opened_at ON email_logs TYPE option<datetime>;
DEFINE FIELD clicked_at ON email_logs TYPE option<datetime>;
DEFINE FIELD metadata ON email_logs TYPE option<object>;
DEFINE FIELD created_at ON email_logs TYPE datetime DEFAULT time::now();
DEFINE INDEX idx_message_id ON email_logs FIELDS message_id;
DEFINE INDEX idx_status ON email_logs FIELDS status;
DEFINE INDEX idx_to_address ON email_logs FIELDS to_address;
DEFINE INDEX idx_created_at ON email_logs FIELDS created_at;

-- Insert default email templates
CREATE email_templates CONTENT {
    name: 'Contact Form Notification',
    slug: 'contact-notification',
    subject: 'New Contact Form Submission: {{service}}',
    body_plain: 'New Contact Form Submission

Full Name: {{full_name}}
Company: {{company_name}}
Email: {{email}}
Phone: {{phone}}
Service: {{service}}
Description:
{{description}}

Submitted at: {{created_at}}',
    body_html: '<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2B9EDB; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">New Contact Form Submission</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">Full Name</div>
                <div class="value">{{full_name}}</div>
            </div>
            <div class="field">
                <div class="label">Company</div>
                <div class="value">{{company_name}}</div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value">{{email}}</div>
            </div>
            <div class="field">
                <div class="label">Phone</div>
                <div class="value">{{phone}}</div>
            </div>
            <div class="field">
                <div class="label">Service</div>
                <div class="value">{{service}}</div>
            </div>
            <div class="field">
                <div class="label">Description</div>
                <div class="value">{{description}}</div>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from your Esperion website contact form.</p>
        </div>
    </div>
</body>
</html>',
    variables: ['full_name', 'company_name', 'email', 'phone', 'service', 'description', 'created_at'],
    category: 'contact',
    is_active: true
};

CREATE email_templates CONTENT {
    name: 'Auto-Reply to Customer',
    slug: 'contact-autoreply',
    subject: 'Thank You for Contacting Esperion - We\'ll Be in Touch Soon',
    body_plain: 'Dear {{full_name}},

Thank you for reaching out to Esperion Digital Agency!

We have received your inquiry regarding {{service}} and our team will get back to you within 24 hours during business days.

Your inquiry details:
{{description}}

If you have any urgent questions, feel free to contact us directly at WhatsApp: +62-xxx-xxxx-xxxx.

Best regards,
Esperion Digital Agency Team',
    body_html: '<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2B9EDB; color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .cta-button { display: inline-block; padding: 12px 30px; background: #2B9EDB; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; border-top: 1px solid #e0e0e0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">Thank You for Contacting Us!</h1>
        </div>
        <div class="content">
            <p>Dear {{full_name}},</p>
            <p>Thank you for reaching out to Esperion Digital Agency!</p>
            <p>We have received your inquiry regarding <strong>{{service}}</strong> and our team will get back to you within 24 hours during business days.</p>
            <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #2B9EDB; margin: 20px 0;">
                <p style="margin: 0;"><strong>Your inquiry:</strong></p>
                <p style="margin: 10px 0 0 0;">{{description}}</p>
            </div>
            <p>If you have any urgent questions, feel free to contact us directly.</p>
            <a href="https://wa.me/62xxxxxxxxxxx" class="cta-button">Chat on WhatsApp</a>
            <p style="margin-top: 30px;">Best regards,<br><strong>Esperion Digital Agency Team</strong></p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Esperion Digital Agency. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
    variables: ['full_name', 'service', 'description'],
    category: 'contact',
    is_active: true
};

CREATE email_templates CONTENT {
    name: 'Welcome Email',
    slug: 'welcome',
    subject: 'Welcome to Esperion Digital Agency!',
    body_plain: 'Welcome {{full_name}}!

Thank you for joining Esperion Digital Agency.

Your account has been created successfully. You can now log in and start managing your content.

Best regards,
Esperion Team',
    body_html: '<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2B9EDB; color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .cta-button { display: inline-block; padding: 12px 30px; background: #2B9EDB; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">Welcome!</h1>
        </div>
        <div class="content">
            <p>Dear {{full_name}},</p>
            <p>Thank you for joining Esperion Digital Agency.</p>
            <p>Your account has been created successfully. You can now log in and start managing your content.</p>
            <a href="{{login_url}}" class="cta-button">Go to Dashboard</a>
        </div>
    </div>
</body>
</html>',
    variables: ['full_name', 'login_url'],
    category: 'user',
    is_active: true
};
