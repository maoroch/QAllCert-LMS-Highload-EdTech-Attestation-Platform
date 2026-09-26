import config from '../config/index.js';
import { logger } from '../utils/logger.js';

const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export class EmailService {
    constructor() {
        this.apiKey = config.resend?.apiKey;
        this.frontendUrl = config.stripe?.frontendUrl || 'http://localhost:3001';
    }

    async sendEmail({ to, subject, html }) {
        if (!this.apiKey) {
            logger.warn('[EmailService] RESEND_API_KEY is not configured. Email logged to console:');
            logger.info(`To: ${to}\nSubject: ${subject}\nHTML: ${html.substring(0, 300)}...`);
            return { mock: true };
        }

        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    from: `EduTech <${FROM_EMAIL}>`,
                    to: [to],
                    subject,
                    html,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to send email via Resend');
            }

            logger.info('[EmailService] Email sent successfully', { to, id: data.id });
            return data;
        } catch (err) {
            logger.error('[EmailService] Error sending email', { error: err.message, to });
            throw err;
        }
    }

    getHtmlTemplate({ title, bodyText, buttonText, buttonUrl, footerText, code }) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background-color: #f8fafc;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    -webkit-font-smoothing: antialiased;
                }
                .wrapper {
                    width: 100%;
                    table-layout: fixed;
                    background-color: #f8fafc;
                    padding: 40px 0;
                }
                .content-card {
                    max-width: 500px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                }
                .gradient-header {
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                    padding: 40px 20px;
                    text-align: center;
                    color: #ffffff;
                }
                .header-logo {
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                    margin: 0 0 10px 0;
                }
                .header-subtitle {
                    font-size: 16px;
                    opacity: 0.9;
                    margin: 0;
                }
                .body-content {
                    padding: 40px 30px;
                    color: #334155;
                    line-height: 1.6;
                    font-size: 16px;
                }
                .btn-container {
                    text-align: center;
                    margin: 35px 0 15px 0;
                }
                .action-btn {
                    display: inline-block;
                    background-color: #6366f1;
                    color: #ffffff !important;
                    text-decoration: none;
                    font-weight: 600;
                    padding: 14px 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -1px rgba(99, 102, 241, 0.1);
                    transition: background-color 0.2s;
                }
                .code-box {
                    text-align: center;
                    margin: 30px 0;
                }
                .code-display {
                    display: inline-block;
                    background-color: #f1f5f9;
                    border: 2px dashed #6366f1;
                    padding: 15px 30px;
                    border-radius: 12px;
                    font-size: 32px;
                    font-weight: 800;
                    letter-spacing: 6px;
                    color: #1e293b;
                }
                .footer {
                    text-align: center;
                    padding: 30px 20px;
                    font-size: 12px;
                    color: #94a3b8;
                }
                .footer a {
                    color: #6366f1;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="content-card">
                    <div class="gradient-header">
                        <div class="header-logo">EduTech</div>
                        <div class="header-subtitle">${title}</div>
                    </div>
                    <div class="body-content">
                        <p>${bodyText}</p>
                        ${code ? `
                        <div class="code-box">
                            <div class="code-display">${code}</div>
                        </div>
                        ` : ''}
                        <div class="btn-container">
                            <a href="${buttonUrl}" class="action-btn" target="_blank">${buttonText}</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>${footerText}</p>
                        <p>&copy; ${new Date().getFullYear()} EduTech. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    async sendPasswordResetEmail(email, token, locale = 'ru') {
        const translations = {
            en: {
                subject: 'Reset your password - EduTech',
                title: 'Password Reset Request',
                body: 'Hello! We received a request to reset your password. Click the button below to choose a new password. This link is valid for 1 hour.',
                btnText: 'Reset Password',
                footer: 'If you did not request this, you can safely ignore this email.'
            },
            ru: {
                subject: 'Восстановление пароля - EduTech',
                title: 'Восстановление пароля',
                body: 'Здравствуйте! Мы получили запрос на сброс вашего пароля. Нажмите кнопку ниже, чтобы выбрать новый пароль. Ссылка действительна в течение 1 часа.',
                btnText: 'Сбросить пароль',
                footer: 'Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.'
            },
            kz: {
                subject: 'Құпия сөзді қалпына келтіру - EduTech',
                title: 'Құпия сөзді қалпына келтіру',
                body: 'Сәлеметсіз бе! Құпия сөзіңізді қалпына келтіру туралы сұраныс алдық. Жаңа құпия сөзді таңдау үшін төмендегі түймені басыңыз. Сілтеме 1 сағат бойы жарамды.',
                btnText: 'Қалпына келтіру',
                footer: 'Егер сіз бұны сұрамасаңыз, бұл хатты елемей-ақ қоюыңызға болады.'
            }
        };

        const t = translations[locale] || translations.ru;
        const buttonUrl = `${this.frontendUrl}/reset-password?token=${token}`;
        const html = this.getHtmlTemplate({
            title: t.title,
            bodyText: t.body,
            buttonText: t.btnText,
            buttonUrl,
            footerText: t.footer
        });

        return this.sendEmail({ to: email, subject: t.subject, html });
    }

    async sendVerificationEmail(email, token, locale = 'ru') {
        const translations = {
            en: {
                subject: 'Verify your email address - EduTech',
                title: 'Welcome to EduTech!',
                body: 'Please confirm your email address by clicking the button below. This will complete your registration.',
                btnText: 'Verify Email',
                footer: 'If you did not register on our website, please ignore this email.'
            },
            ru: {
                subject: 'Подтверждение email - EduTech',
                title: 'Добро пожаловать в EduTech!',
                body: 'Пожалуйста, подтвердите ваш адрес электронной почты, нажав на кнопку ниже. Это завершит вашу регистрацию.',
                btnText: 'Подтвердить email',
                footer: 'Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.'
            },
            kz: {
                subject: 'Email мекенжайын растау - EduTech',
                title: 'EduTech-ке қош келдіңіз!',
                body: 'Тіркелуді аяқтау үшін төмендегі түймені басып, email мекенжайыңызды растаңыз.',
                btnText: 'Email-ді растау',
                footer: 'Егер сіз біздің сайтта тіркелмесеңіз, бұл хатты елемеңіз.'
            }
        };

        const t = translations[locale] || translations.ru;
        const buttonUrl = `${this.frontendUrl}/verify-email?token=${token}`;
        const html = this.getHtmlTemplate({
            title: t.title,
            bodyText: t.body,
            buttonText: t.btnText,
            buttonUrl,
            footerText: t.footer,
            code: token
        });

        return this.sendEmail({ to: email, subject: t.subject, html });
    }
}
