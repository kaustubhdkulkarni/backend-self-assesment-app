const nodemailer = require("nodemailer");
const moment = require("moment");
const logger = require("../config/logger");
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const SENDGRID_FROM = process.env.SENDGRID_FROM;

// async function sendEmail({ to, subject, html, attachments, from = process.env.APP_MAIL }) {
// 	// Ensure necessary environment variables are defined
// 	if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.APP_MAIL || !process.env.APP_MAIL_PASSWORD) {
// 		throw new Error('SMTP configuration or email credentials are missing');
// 	}

// 	// Create transporter with timeout and necessary auth
// 	const transporter = nodemailer.createTransport({
// 		host: process.env.SMTP_HOST,
// 		port: process.env.SMTP_PORT,
// 		auth: {
// 			user: process.env.APP_MAIL,
// 			pass: process.env.APP_MAIL_PASSWORD
// 		},
// 		timeout: 10000,  // Timeout after 10 seconds if not connected
// 	});

// 	try {
// 		// Send email and log success
// 		await transporter.sendMail({
// 			from: `'Wadiaa CI' <${from}>`,
// 			to, subject, html, attachments
// 		});

// 		console.log(`Email successfully sent to ${to}`);
// 	} catch (error) {
// 		// Log and throw an error if the email fails to send
// 		console.error(`Failed to send email to ${to}:`, error);
// 		throw new Error('Email sending failed');
// 	}
// }

const to3 = (n) => {
	const trimmed = Math.trunc(Number(n) * 1000) / 1000;
	return trimmed.toString().includes(".")
		? trimmed.toString().padEnd(trimmed.toString().indexOf(".") + 4, "0")
		: trimmed.toString() + ".000";
};


async function sendEmail({ to, subject, html, from = SENDGRID_FROM, replyTo }) {
	if (!process.env.SENDGRID_API_KEY || !SENDGRID_FROM) {
		throw new Error("SendGrid API key or sender email is missing");
	}

	const mailObj = {
		to,
		from:
			typeof from === "string" ? { email: from, name: "Wadiaa Admin" } : from,
		subject,
		html,
	};

	if (replyTo) {
		mailObj.replyTo = replyTo;
	}

	try {
		await sendGridMail.send(mailObj);
		console.log(`Email successfully sent to ${to}`);
	} catch (error) {
		console.error(
			`Failed to send email to ${to}:`,
			error?.response?.body || error
		);
		throw new Error("Email sending failed");
	}
}

async function sendWelcomeEmailToUser({ userObj }) {
	const message = `
	<div style="width:100%; padding:20px; background:#f9f9f9; border-radius:8px; font-family:'Segoe UI', sans-serif; color:#333;">
  
	  <!-- Header Logo -->
	  <div style="text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="Wadiaa Logo"
		  style="width:60%; max-width:60%; height:auto; margin-bottom:20px;"
		/>
	  </div>
  
	  <!-- English Section -->
	  <div style="direction:ltr; text-align:left;">
		<h2 style="color:#184274;">Dear ${userObj.firstName} ${userObj.lastName},</h2>
		<p style="font-size:16px; line-height:1.6;">
		  Welcome to <strong>Wadiaa</strong>! 🎉 We are thrilled to have you on board.
		</p>
		<p style="font-size:16px; line-height:1.6;">
		  With Wadiaa, you can easily ${userObj.role === "fundraiser"
			? "create campaigns, reach potential investors, and raise funds for your projects"
			: "explore and invest in various fundraising campaigns that match your interests"
		}.
		</p>
		<p style="font-size:16px; line-height:1.6;">
		  Get started by exploring your account dashboard and discovering all the features we have to offer.
		</p>
		<p style="font-size:16px; line-height:1.6;">
		  If you have any questions or need assistance, feel free to reach out to us. We are here to help!
		</p>
	  </div>
  
	  <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;" />
  
	  <!-- Arabic Section -->
	  <div style="direction:rtl; text-align:right;">
		<h2 style="color:#184274;">عزيزي/عزيزتي ${userObj.firstName} ${userObj.lastName
		}،</h2>
		<p style="font-size:16px; line-height:1.6;">
		  مرحبًا بك في <strong>وديعة</strong>! 🎉 نحن سعداء بانضمامك إلينا.
		</p>
		<p style="font-size:16px; line-height:1.6;">
		  مع وديعة، يمكنك ${userObj.role === "fundraiser"
			? "إنشاء حملات، والوصول إلى المستثمرين المحتملين، وجمع الأموال لمشاريعك"
			: "استكشاف والاستثمار في مختلف حملات جمع التبرعات التي تتناسب مع اهتماماتك"
		}.
		</p>
		<p style="font-size:16px; line-height:1.6;">
		  ابدأ باستكشاف لوحة تحكم حسابك واكتشاف جميع الميزات التي نقدمها.
		</p>
		<p style="font-size:16px; line-height:1.6;">
		  إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، لا تتردد في التواصل معنا. نحن هنا للمساعدة!
		</p>
	  </div>
  
	  <hr style="margin:30px 0; border:none; border-top:1px solid #ddd;" />
  
	  <!-- Sign-off -->
	  <p style="font-size:14px; color:#888; text-align:left;">
		Best regards,<br/>
		The Wadiaa Team
	  </p>
	  <p style="font-size:14px; color:#888; text-align:right; direction:rtl;">
		مع أطيب التحيات،<br/>
		فريق وديعة
	  </p>
  
	  <div style="text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaGif.gif"
		  alt="Wadiaa GIF"
		  style="width:60%; max-width:80%; height:auto; margin-bottom:20px;"
		/>
	  </div>
  
	  <!-- Call to Action -->
	  <div style="text-align:center; margin-top:30px;">
		<a href="https://wadiaa.com"
		   style="display:inline-block; padding:10px 20px; background:#184274; color:#fff; text-decoration:none; border-radius:6px;">
		  Visit Our Website | قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: userObj.email,
			subject: "Welcome to Wadiaa! - مرحبًا بك في وديعة!",
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Welcome email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending welcome email:", error);
		return { status: false, code: 500, msg: "Failed to send welcome email." };
	}
}

async function sendFeedBackEmailByUser({ name, email, message, phone }) {
	try {
		const emailContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://wadiaa.com/wadiaaLogo.png" alt="Wadiaa Logo" style="height: 50px;" />
        <h2 style="color: #184274; margin-top: 10px;">New User Feedback Submission</h2>
      </div>

      <p style="font-size: 16px; color: #333;">Hello Team,</p>
      <p style="font-size: 16px; color: #333;">
        A new feedback has been submitted through the Wadiaa website. Please find the details below:
      </p>

      <table style="width: 100%; margin-top: 20px; font-size: 15px; color: #444;">
        <tr>
          <td style="padding: 8px 0;"><strong>Name:</strong></td>
          <td style="padding: 8px 0;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Email:</strong></td>
          <td style="padding: 8px 0;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Phone:</strong></td>
          <td style="padding: 8px 0;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; vertical-align: top;"><strong>Message:</strong></td>
          <td style="padding: 8px 0;">${message}</td>
        </tr>
      </table>

      <p style="margin-top: 30px; font-size: 14px; color: #888;">
        This message was sent from the Wadiaa website feedback form.
      </p>

      <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />

      <div style="text-align: center; font-size: 13px; color: #aaa; margin-top: 10px;">
        © ${new Date().getFullYear()} Wadiaa. All rights reserved.
      </div>
    </div>
  </div>
`;

		const automatedFeedbackReply = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI',sans-serif;color:#333;">
	<div style="text-align:center;">
	  <img src="https://wadiaa.com/wadiaaLogo.png" alt="Wadiaa Logo" style="width:60%;max-width:60%;height:auto;margin-bottom:20px;"/>
	</div>

    <div style="direction:ltr;text-align:left;">
      <h2 style="color:#184274;">Hello ${name},</h2>
      <p style="font-size:16px;line-height:1.6;">
        Thank you for getting in touch with <strong>Wadiaa</strong>! We've successfully received your message.
      </p>
      <p style="font-size:16px;line-height:1.6;">
        One of our professionals will review your inquiry and reach out to you as soon as possible. We appreciate your patience.
      </p>
      <p style="font-size:16px;line-height:1.6;">
        If your request is urgent, feel free to email us directly at
        <a href="mailto:info@wadiaa.com" style="color:#0077cc;">info@wadiaa.com</a> or call us at <a href="tel:+96893223422" style="color:#0077cc;">+968 9322 3422</a>.
      </p>
    </div>

    <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />

    <div style="direction:rtl;text-align:right;">
      <h2 style="color:#184274;">مرحبًا ${name}،</h2>
      <p style="font-size:16px;line-height:1.6;">
        شكرًا لتواصلك مع <strong>وديعـة</strong>! لقد استلمنا رسالتك بنجاح.
      </p>
      <p style="font-size:16px;line-height:1.6;">
        سيقوم أحد أعضاء فريقنا المختصين بمراجعة استفسارك والرد عليك في أقرب وقت ممكن. نشكرك على صبرك.
      </p>
      <p style="font-size:16px;line-height:1.6;">
        إذا كانت رسالتك عاجلة، لا تتردد في التواصل معنا عبر البريد الإلكتروني
        <a href="mailto:info@wadiaa.com" style="color:#0077cc;">info@wadiaa.com</a> أو الاتصال على الرقم <a href="tel:+96893223422" style="color:#0077cc;">+968 9322 3422</a>.
      </p>
    </div>

    <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />

    <p style="font-size:14px;color:#888;text-align:left;">
      Best regards,<br/>
      The Wadiaa Team
    </p>
    <p style="font-size:14px;color:#888;text-align:right;direction:rtl;">
      مع أطيب التحيات،<br/>
      فريق وديعـة
    </p>
	<img src="https://wadiaa.com/wadiaaGif.gif" alt="Wadiaa Logo" style="width:60%;max-width:80%;height:auto;margin-bottom:20px;" />

    <div style="text-align:center;margin-top:30px;">
      <a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
        Visit Our Website | قم بزيارة موقعنا
      </a>
    </div>
  </div>
`;

		await sendEmail({
			to: "info@wadiaa.com",
			from: {
				email: SENDGRID_FROM,
				name: name,
			},
			replyTo: email,
			subject: "New User Feedback",
			html: emailContent,
		});

		await sendEmail({
			to: email,
			subject: "Thank you for contacting Wadiaa",
			html: automatedFeedbackReply,
		});

		return {
			status: true,
			code: 200,
			data: "User feedback sent successfully.",
		};
	} catch (error) {
		console.error("Error sending user feedback:", error);
		return { status: false, code: 500, msg: "Failed to send feedback email." };
	}
}

async function accountLockedMail(user) {
	const lockTime = moment(user.lockedUntil).format("lll");

	const message = `
  <h4 style="font-size:16px;line-height:1.6;color:#FF0000;"><b>Warning:</b> Account Locked</h4>
  <div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI',sans-serif;color:#333;">
    <div style="text-align:center;">
      <img src="https://wadiaa.com/wadiaaLogo.png" alt="Wadiaa Logo" style="width:60%;max-width:60%;height:auto;margin-bottom:20px;" />
    </div>

    <!-- English Section -->
    <div style="direction:ltr;text-align:left;">
      <h2 style="color:#b60000;">Dear ${user.firstName} ${user.lastName},</h2>
      <p style="font-size:16px;line-height:1.6;">
        We've detected multiple unsuccessful login attempts on your account. For security reasons, your account has been <strong>temporarily locked</strong>.
      </p>
      <p style="font-size:16px;line-height:1.6;"><strong>Locked Until:</strong> ${lockTime}</p>
      <p style="font-size:16px;line-height:1.6;">To regain access, you may:</p>
      <ul style="font-size:16px;line-height:1.6;padding-left:20px;">
        <li>Wait until the lock period expires and try logging in again.</li>
        <li>If urgent, please contact our support team for assistance.</li>
      </ul>
      <p style="font-size:16px;line-height:1.6;">
        For further assistance, reach out to us at 
        <a href="mailto:info@wadiaa.com" style="color:#0077cc;">info@wadiaa.com</a> or call <a href="tel:+96893223422" style="color:#0077cc;">+968 9322 3422</a>.
      </p>
    </div>

    <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />

    <!-- Arabic Section -->
    <div style="direction:rtl;text-align:right;">
      <h2 style="color:#b60000;">عزيزي ${user.firstName} ${user.lastName}،</h2>
      <p style="font-size:16px;line-height:1.6;">
        لقد اكتشفنا محاولات تسجيل دخول غير ناجحة متعددة إلى حسابك. لأسباب أمنية، تم <strong>قفل حسابك مؤقتًا</strong>.
      </p>
      <p style="font-size:16px;line-height:1.6;"><strong>مغلق حتى:</strong> ${lockTime}</p>
      <p style="font-size:16px;line-height:1.6;">لاستعادة الوصول إلى حسابك:</p>
      <ul style="font-size:16px;line-height:1.6;padding-right:20px;">
        <li>يرجى الانتظار حتى انتهاء فترة القفل ثم المحاولة مرة أخرى.</li>
        <li>إذا كانت الحالة عاجلة، يرجى التواصل مع فريق الدعم لدينا للمساعدة.</li>
      </ul>
      <p style="font-size:16px;line-height:1.6;">
        لمزيد من الدعم، تواصل معنا عبر البريد الإلكتروني
        <a href="mailto:info@wadiaa.com" style="color:#0077cc;">info@wadiaa.com</a>
        أو الاتصال على الرقم
        <a href="tel:+96893223422" style="color:#0077cc;">+968 9322 3422</a>.
      </p>
    </div>

    <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />

    <p style="font-size:14px;color:#888;text-align:left;">
      Best regards,<br/>
      The Wadiaa Team
    </p>
    <p style="font-size:14px;color:#888;text-align:right;direction:rtl;">
      مع أطيب التحيات،<br/>
      فريق وديعة
    </p>
	<img src="https://wadiaa.com/wadiaaGif.gif" alt="Wadiaa Logo" style="width:60%;max-width:80%;height:auto;margin-bottom:20px;" />

    <div style="text-align:center;margin-top:30px;">
      <a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
        Visit Our Website | قم بزيارة موقعنا
      </a>
    </div>
  </div>
`;

	try {
		await sendEmail({
			to: user.email,
			subject: "Wadiaa: Multiple Login Attempts Detected!",
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Account lock email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending account lock email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send account lock email.",
		};
	}
}

async function sendSignupEmailForBackofficeUsers(user, password) {
	const message = `
  	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI',sans-serif;color:#333;">
  	<div style="text-align:center;">
		<img src="https://wadiaa.com/wadiaaLogo.png" alt="Wadiaa Logo" style="width:60%;max-width:60%;height:auto;margin-bottom:20px;" />
		<h4 style="margin-top:-10px;color:#184274;font-size:20px;">Welcome to Wadiaa</h4>
 	 </div>
  
	  <h2 style="color:#184274;">Dear ${user.firstName} ${user.lastName},</h2>
  
	  <p style="font-size:16px;line-height:1.6;">
		Welcome to <strong>Wadiaa</strong>! We are thrilled to have you on board.
	  </p>
  
	  <p style="font-size:16px;line-height:1.6;">
		Your account has been successfully created. Below are your login details:
	  </p>
  
	  <ul style="font-size:16px;line-height:1.8;padding-left:20px;">
		<li><strong>Email:</strong> ${user.email}</li>
		<li><strong>Password:</strong> ${password}</li>
	  </ul>
  
	  <p style="font-size:16px;line-height:1.6;">
		For security reasons, we strongly recommend changing your password after your first login.
	  </p>
  
	  <p style="font-size:16px;line-height:1.6;">
		To get started, please visit our platform and log in using your credentials.
	  </p>
  
	  <p style="font-size:16px;line-height:1.6;">
		If you have any questions, feel free to contact us at 
		<a href="mailto:info@wadiaa.com" style="color:#0077cc;">info@wadiaa.com</a> or call 
		<a href="tel:+96893223422" style="color:#0077cc;">+968 9322 3422</a>.
	  </p>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888;">
		Best regards,<br/>
		The Wadiaa Team
	  </p>
	  <img src="https://wadiaa.com/wadiaaGif.gif" alt="Wadiaa Logo" style="width:60%;max-width:80%;height:auto;margin-bottom:20px;" />
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: "Warm Welcome to Wadiaa - Your Account is Ready!",
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Signup email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending signup email:", error);
		return { status: false, code: 500, msg: "Failed to send signup email." };
	}
}

async function sendVerificationEmail(user, inviteLink) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
  
	  <div style="direction:ltr;text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="Wadiaa Logo"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
		<h4 style="font-family: 'Segoe UI', Arial, sans-serif; color: #184274; font-size: 20px; margin-top: 0; margin-bottom: 16px;">
		  Welcome to Wadiaa!
		</h4>
  
		<h2 style="color:#184274;">Dear ${user.firstName || "User"},</h2>
  
		<p style="font-size:16px;line-height:1.6;">
		  Thank you for registering with <strong>Wadiaa</strong>! To complete your sign-up process, please verify your email address by clicking the button below:
		</p>
  
		<div style="text-align:center;margin:30px 0;">
		  <a href="${inviteLink}" target="_blank" style="
			background-color: #28a745;
			color: #ffffff;
			padding: 12px 24px;
			text-decoration: none;
			border-radius: 6px;
			font-size: 16px;
			font-weight: bold;
			font-family:'Segoe UI', sans-serif;
			display: inline-block;
		  ">
			Verify Email
		  </a>
		</div>
  
		<p style="font-size:16px;line-height:1.6;">
		  If you didn’t sign up for Wadiaa, you can safely ignore this email.
		</p>
	  </div>
  
	  <hr style="margin:40px 0;border:none;border-top:2px solid #184274;" />
  
	  <div style="direction:rtl;text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="شعار وديعة"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
		<h4 style="font-family: 'Segoe UI', Arial, sans-serif; color: #184274; font-size: 20px; margin-top: 0; margin-bottom: 16px;">
		  مرحبًا بكم في وديعة!
		</h4>
  
		<h2 style="color:#184274;">عزيزي/عزيزتي ${user.firstName || "المستخدم"},</h2>
  
		<p style="font-size:16px;line-height:1.6;">
		  شكرًا لتسجيلك في <strong>وديعة</strong>! لإكمال عملية التسجيل، يرجى التحقق من بريدك الإلكتروني بالنقر على الزر أدناه:
		</p>
  
		<div style="text-align:center;margin:30px 0;">
		  <a href="${inviteLink}" target="_blank" style="
			background-color: #28a745;
			color: #ffffff;
			padding: 12px 24px;
			text-decoration: none;
			border-radius: 6px;
			font-size: 16px;
			font-weight: bold;
			font-family:'Segoe UI', sans-serif;
			display: inline-block;
		  ">
			تحقق من البريد الإلكتروني
		  </a>
		</div>
  
		<p style="font-size:16px;line-height:1.6;">
		  إذا لم تقم بالتسجيل في وديعة، يمكنك تجاهل هذا البريد بأمان.
		</p>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888;text-align:center;">
		Best regards / مع أطيب التحيات,<br/>
		The Wadiaa Team / فريق وديعة
	  </p>
	  <img src="https://wadiaa.com/wadiaaGif.gif" alt="Wadiaa Logo" style="width:60%;max-width:80%;height:auto;margin-bottom:20px;" />
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: "Verify Your Email - Wadiaa",
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Verification email sent successfully.",
		};
	} catch (error) {
		console.error("Error sending verification email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send verification email.",
		};
	}
}

async function sendForgotPasswordEmail(user, resetLink) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
  
	  <!-- English Section -->
	  <div style="direction:ltr;text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="Wadiaa Logo"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
		<h4 style="margin-top:-10px;color:#184274;font-size:20px;">Welcome to Wadiaa</h4>
  
		<h2 style="color:#184274;">Dear ${user.firstName || "User"},</h2>
  
		<p style="font-size:16px;line-height:1.6;">
		  We received a request to reset your password. Click the button below to set a new password:
		</p>
  
		<div style="text-align:center;margin:30px 0;">
		  <a href="${resetLink}" target="_blank" style="
			background-color: #1579e1;
			color: #ffffff;
			padding: 12px 24px;
			text-decoration: none;
			border-radius: 6px;
			font-size: 16px;
			font-weight: bold;
			font-family:'Segoe UI', sans-serif;
			display: inline-block;
		  ">
			Reset Password
		  </a>
		</div>
  
		<p style="font-size:16px;line-height:1.6;">
		  If you did not request a password reset, you can safely ignore this email.
		</p>
	  </div>
  
	  <hr style="margin:40px 0;border:none;border-top:2px solid #184274;" />
  
	  <!-- Arabic Section -->
	  <div style="direction:rtl;text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="شعار وديعة"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
		<h4 style="margin-top:-10px;color:#184274;font-size:20px;">مرحبًا بكم في وديعة</h4>
  
		<h2 style="color:#184274;">عزيزي/عزيزتي ${user.firstName || "المستخدم"},</h2>
  
		<p style="font-size:16px;line-height:1.6;">
		  لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك. اضغط على الزر أدناه لتعيين كلمة مرور جديدة:
		</p>
  
		<div style="text-align:center;margin:30px 0;">
		  <a href="${resetLink}" target="_blank" style="
			background-color: #1579e1;
			color: #ffffff;
			padding: 12px 24px;
			text-decoration: none;
			border-radius: 6px;
			font-size: 16px;
			font-weight: bold;
			font-family:'Segoe UI', sans-serif;
			display: inline-block;
		  ">
			إعادة تعيين كلمة المرور
		  </a>
		</div>
  
		<p style="font-size:16px;line-height:1.6;">
		  إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد بأمان.
		</p>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888;text-align:center;">
		Best regards / مع أطيب التحيات,<br/>
		The Wadiaa Team / فريق وديعة
	  </p>
  
	  <img src="https://wadiaa.com/wadiaaGif.gif" alt="Wadiaa Logo" style="width:60%;max-width:80%;height:auto;margin:20px auto;display:block;" />
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: "Reset Your Password - Wadiaa",
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Password reset email sent successfully.",
		};
	} catch (error) {
		console.error("Error sending password reset email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send password reset email.",
		};
	}
}

async function sendOtpAccountVerification(user, otp) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
  
	  <!-- English Section -->
	  <div style="direction:ltr;text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="Wadiaa Logo"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
		<h4 style="margin-top:-10px;color:#184274;font-size:20px;">Account Verification Service</h4>
  
		<h2 style="color:#184274;">Hi ${user.firstName || "User"} ${user?.lastName || ""
		},</h2>
  
		<p style="font-size:16px;line-height:1.6;">
		  Your OTP code for account verification is:
		</p>
  
		<div style="text-align:center;margin:20px 0;">
		  <span style="
			display: inline-block;
			padding: 12px 24px;
			background-color: #184274;
			color: #ffffff;
			font-size: 20px;
			font-weight: bold;
			letter-spacing: 4px;
			border-radius: 6px;
			font-family: 'Segoe UI', sans-serif;
		  ">
			${otp}
		  </span>
		</div>
  
		<p style="font-size:16px;line-height:1.6;">
		  Please use this code to verify your account. This OTP will expire in 5 minutes.
		</p>
  
		<p style="font-size:16px;line-height:1.6;">
		  If you did not request this, please ignore this email.
		</p>
	  </div>
  
	  <hr style="margin:40px 0;border:none;border-top:2px solid #184274;" />
  
	  <!-- Arabic Section -->
	  <div style="direction:rtl;text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="شعار وديعة"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
		<h4 style="margin-top:-10px;color:#184274;font-size:20px;">خدمة التحقق من الحساب</h4>
  
		<h2 style="color:#184274;">مرحبًا ${user.firstName || "المستخدم"} ${user?.lastName || ""
		}،</h2>
  
		<p style="font-size:16px;line-height:1.6;">
		  رمز التحقق الخاص بك لتأكيد الحساب هو:
		</p>
  
		<div style="text-align:center;margin:20px 0;">
		  <span style="
			display: inline-block;
			padding: 12px 24px;
			background-color: #184274;
			color: #ffffff;
			font-size: 20px;
			font-weight: bold;
			letter-spacing: 4px;
			border-radius: 6px;
			font-family: 'Segoe UI', sans-serif;
		  ">
			${otp}
		  </span>
		</div>
  
		<p style="font-size:16px;line-height:1.6;">
		  يرجى استخدام هذا الرمز للتحقق من حسابك. سينتهي صلاحية رمز التحقق خلال 5 دقائق.
		</p>
  
		<p style="font-size:16px;line-height:1.6;">
		  إذا لم تطلب هذا، يرجى تجاهل هذا البريد.
		</p>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888;text-align:center;">
		Best regards / مع أطيب التحيات,<br/>
		The Wadiaa Team / فريق وديعة
	  </p>

	  <img src="https://wadiaa.com/wadiaaGif.gif" alt="Wadiaa Logo" style="width:60%;max-width:80%;height:auto;margin:20px auto;display:block;" />
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: "Wadiaa Update: OTP Code for Account Verification",
			html: `${message}`,
		});
		logger.info(
			`OTP for account verification has been sent to your email ${user?.email}.`
		);

		return {
			status: true,
			code: 200,
			data: "OTP for account verification has been sent to your email.",
		};
	} catch (error) {
		console.error("Error sending account verification OTP email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send OTP email for account verification.",
		};
	}
}

async function sendOtpEmail(user, otp) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
	  
	  <!-- English Section -->
	  <div style="direction:ltr;text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="Wadiaa Logo"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
		<h4 style="margin-top:-10px;color:#184274;font-size:20px;">OTP Verification</h4>
  
		<h2 style="color:#184274;">Hi ${user.firstName || "User"},</h2>
  
		<p style="font-size:16px;line-height:1.6;">
		  Your OTP code is:
		</p>
  
		<div style="text-align:center;margin:20px 0;">
		  <span style="
			display: inline-block;
			padding: 12px 24px;
			background-color: #184274;
			color: #ffffff;
			font-size: 20px;
			font-weight: bold;
			letter-spacing: 4px;
			border-radius: 6px;
			font-family: 'Segoe UI', sans-serif;
		  ">
			${otp}
		  </span>
		</div>
  
		<p style="font-size:16px;line-height:1.6;">
		  Please use this code to complete your investment verification process. This code will expire in 5 minutes.
		</p>
  
		<p style="font-size:16px;line-height:1.6;">
		  If you did not request this, you can safely ignore this email.
		</p>
	  </div>
  
	  <hr style="margin:40px 0;border:none;border-top:2px solid #184274;" />
  
	  <!-- Arabic Section -->
	  <div style="direction:rtl;text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="شعار وديعة"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
		<h4 style="margin-top:-10px;color:#184274;font-size:20px;">التحقق من رمز التحقق (OTP)</h4>
  
		<h2 style="color:#184274;">مرحبًا ${user.firstName || "المستخدم"},</h2>
  
		<p style="font-size:16px;line-height:1.6;">
		  رمز التحقق الخاص بك هو:
		</p>
  
		<div style="text-align:center;margin:20px 0;">
		  <span style="
			display: inline-block;
			padding: 12px 24px;
			background-color: #184274;
			color: #ffffff;
			font-size: 20px;
			font-weight: bold;
			letter-spacing: 4px;
			border-radius: 6px;
			font-family: 'Segoe UI', sans-serif;
		  ">
			${otp}
		  </span>
		</div>
  
		<p style="font-size:16px;line-height:1.6;">
		  يرجى استخدام هذا الرمز لإكمال عملية التحقق من استثمارك. سينتهي صلاحية هذا الرمز خلال 5 دقائق.
		</p>
  
		<p style="font-size:16px;line-height:1.6;">
		  إذا لم تطلب هذا، يمكنك تجاهل هذا البريد بأمان.
		</p>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888;text-align:center;">
		Best regards / مع أطيب التحيات,<br/>
		The Wadiaa Team / فريق وديعة
	  </p>
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: "Wadiaa: OTP Code for Investment Verification",
			html: `${message}`,
		});
		return {
			status: true,
			code: 200,
			data: "OTP has been sent to your email.",
		};
	} catch (error) {
		console.error("Error sending OTP email:", error);
		return { status: false, code: 500, msg: "Failed to send OTP email." };
	}
}

async function signInvestmentContractEmailOtp(user, otp) {
	const message = `
	<div style="
	  width: 100%;
	  padding: 20px;
	  background: #f9f9f9;
	  border-radius: 8px;
	  font-family: 'Segoe UI', sans-serif;
	  color: #333;
	">
	  <div style="text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="Wadiaa Logo"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
		<h4 style="margin-top:-10px;color:#184274;font-size:20px;">
		  Email Verification Required / مطلوب التحقق من البريد الإلكتروني
		</h4>
	  </div>
  
	  <div style="
		display: flex;
		flex-wrap: wrap;
		gap: 30px;
		justify-content: center;
		margin-top: 20px;
	  ">
		<!-- English Section -->
		<div style="flex: 1 1 300px; min-width: 280px; max-width: 400px;">
		  <h2 style="color:#184274;">Hi ${user.firstName || "User"},</h2>
		  <p style="font-size:16px;line-height:1.6;">
			Your OTP code is:
		  </p>
		  <div style="text-align:center;margin:20px 0;">
			<span style="
			  display: inline-block;
			  padding: 12px 24px;
			  background-color: #184274;
			  color: #ffffff;
			  font-size: 20px;
			  font-weight: bold;
			  letter-spacing: 4px;
			  border-radius: 6px;
			  font-family: 'Segoe UI', sans-serif;
			">
			  ${otp}
			</span>
		  </div>
		  <p style="font-size:16px;line-height:1.6;">
			Please enter this code to verify your email and proceed with signing your investment contract. This code will expire in 5 minutes.
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			If you did not request this, you can safely ignore this email.
		  </p>
		</div>
  
		<!-- Arabic Section -->
		<div dir="rtl" style="flex: 1 1 300px; min-width: 280px; max-width: 400px; font-family: 'Segoe UI', sans-serif;">
		  <h2 style="color:#184274; text-align: right;">مرحبًا ${user.firstName || "المستخدم"
		},</h2>
		  <p style="font-size:16px;line-height:1.6; text-align: right;">
			رمز التحقق الخاص بك هو:
		  </p>
		  <div style="text-align:center;margin:20px 0;">
			<span style="
			  display: inline-block;
			  padding: 12px 24px;
			  background-color: #184274;
			  color: #ffffff;
			  font-size: 20px;
			  font-weight: bold;
			  letter-spacing: 4px;
			  border-radius: 6px;
			  font-family: 'Segoe UI', sans-serif;
			">
			  ${otp}
			</span>
		  </div>
		  <p style="font-size:16px;line-height:1.6; text-align: right;">
			يرجى إدخال هذا الرمز للتحقق من بريدك الإلكتروني والمتابعة لتوقيع عقد الاستثمار الخاص بك. سينتهي صلاحية هذا الرمز خلال 5 دقائق.
		  </p>
		  <p style="font-size:16px;line-height:1.6; text-align: right;">
			إذا لم تطلب هذا، يمكنك تجاهل هذا البريد بأمان.
		  </p>
		</div>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888;">
		Best regards,<br/>
		The Wadiaa Team<br/><br/>
		مع أطيب التحيات،<br/>
		فريق وديع
	  </p>
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="
		  display:inline-block;
		  padding:10px 20px;
		  background:#184274;
		  color:#fff;
		  text-decoration:none;
		  border-radius:6px;
		  font-family: 'Segoe UI', sans-serif;
		">
		  Visit Our Website / زيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: "Wadiaa: Verify OTP Investment Contract",
			html: `${message}`,
		});
		return {
			status: true,
			code: 200,
			data: "An OTP has been sent to your email for verification.",
		};
	} catch (error) {
		console.error("Error sending OTP email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send OTP email for verification.",
		};
	}
}

async function sendCampaignRegistrationFeeReminder({ userObj, emailBody }) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
	  <div style="text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="Wadiaa Logo"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
	  </div>
  
	  <div style="display:flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
		<!-- English -->
		<div style="flex:1 1 300px; max-width:400px;">
		  <h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
			Action Required: Complete Your Campaign Registration Fee Payment
		  </h4>
  
		  <p style="font-size:16px;line-height:1.6;">
			Dear ${userObj.firstName || "User"} ${userObj.lastName || ""},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			We kindly remind you to complete the registration fee payment of
			<strong>${emailBody?.campaignRegistrationFee} OMR</strong> for your campaign,
			<strong>${emailBody?.campaignName}</strong>, to proceed with its activation.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			Ensuring timely payment will allow your campaign to go live and start receiving support.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			If you have already made the payment, kindly ignore this message. If you have any questions or require assistance, please do not hesitate to contact us.
		  </p>
		</div>
  
		<!-- Arabic -->
		<div dir="rtl" style="flex:1 1 300px; max-width:400px; font-family: 'Segoe UI', sans-serif; text-align: right;">
		  <h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
			مطلوب إجراء: أكمل دفع رسوم تسجيل حملتك
		  </h4>
  
		  <p style="font-size:16px;line-height:1.6;">
			عزيزي/عزيزتي ${userObj.firstName || "المستخدم"} ${userObj.lastName || ""},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			نود تذكيرك بإتمام دفع رسوم التسجيل البالغة
			<strong>${emailBody?.campaignRegistrationFee} ريال عماني</strong>
			لحملتك،
			<strong>${emailBody?.campaignName}</strong>
			للمضي قدمًا في تفعيلها.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			ضمان الدفع في الوقت المناسب سيمكن حملتك من أن تكون نشطة وتبدأ في تلقي الدعم.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			إذا كنت قد أتممت الدفع بالفعل، يرجى تجاهل هذه الرسالة. إذا كان لديك أي استفسارات أو تحتاج إلى مساعدة، لا تتردد في الاتصال بنا.
		  </p>
		</div>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888; line-height:1.4;">
		Best regards,<br/>
		The Wadiaa Team<br/><br/>
		مع أطيب التحيات،<br/>
		فريق وديع
	  </p>
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / زيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: userObj.email,
			subject: `Wadiaa: ${emailBody?.campaignName} Campaign Fee Payment Reminder`,
			html: `${message}`,
		});

		console.log(
			`Campaign registration fee reminder email has been sent successfully for ${emailBody?.campaignName}.`
		);

		return {
			status: true,
			code: 200,
			data: "Campaign registration fee reminder email has been sent successfully.",
		};
	} catch (error) {
		console.error(
			"Error sending campaign registration fee reminder email:",
			error
		);
		return {
			status: false,
			code: 500,
			msg: "Failed to send campaign registration fee reminder email.",
		};
	}
}

async function sendRepaymentEmailForFundraiser(user) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
	  <div style="text-align:center;">
		<img 
		  src="https://wadiaa.com/wadiaaLogo.png" 
		  alt="Wadiaa Logo" 
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
	  </div>
  
	  <div style="display:flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
		<!-- English -->
		<div style="flex:1 1 300px; max-width:400px;">
		  <h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
			Repayment Schedule Notification
		  </h4>
  
		  <p style="font-size:16px;line-height:1.6;">
			Dear ${user.firstName || "User"},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			We are pleased to inform you that your repayment schedule for your new campaign has been successfully created.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			You can review the repayment schedule details in your account dashboard. If you have any questions or need further assistance, please do not hesitate to contact us.
		  </p>
		</div>
  
		<!-- Arabic -->
		<div dir="rtl" style="flex:1 1 300px; max-width:400px; font-family:'Segoe UI', sans-serif; text-align: right;">
		  <h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
			إشعار جدول السداد
		  </h4>
  
		  <p style="font-size:16px;line-height:1.6;">
			عزيزي/عزيزتي ${user.firstName || "المستخدم"},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			يسرنا إبلاغك بأنه تم إنشاء جدول السداد الخاص بحملتك الجديدة بنجاح.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			يمكنك مراجعة تفاصيل جدول السداد في لوحة التحكم الخاصة بك. إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة إضافية، فلا تتردد في الاتصال بنا.
		  </p>
		</div>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888; line-height:1.4;">
		Best regards,<br/>
		The Wadiaa Team<br/><br/>
		مع أطيب التحيات،<br/>
		فريق وديع
	  </p>
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / زيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: `Wadiaa: Repayment Schedule Created`,
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Repayment schedule email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending repayment email:", error);
		return { status: false, code: 500, msg: "Failed to send repayment email." };
	}
}

async function sendCampaignSuspendedEmail(user, campaign) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
	  <div style="text-align:center;">
		<img 
		  src="https://wadiaa.com/wadiaaLogo.png" 
		  alt="Wadiaa Logo" 
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
	  </div>
  
	  <div style="display:flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
		<!-- English Section -->
		<div style="flex:1 1 300px; max-width:400px;">
		  <h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
			Important: Campaign Suspension Notice
		  </h4>
  
		  <p style="font-size:16px;line-height:1.6;">
			Dear ${user.firstName || "User"},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			We would like to inform you that your campaign <strong>${campaign.campaignName
		}</strong> has been temporarily suspended by the admin.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			During this suspension period, your campaign will not be visible to investors.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			If you have any questions or believe this was done in error, please contact our support team for clarification.
		  </p>
		</div>
  
		<!-- Arabic Section -->
		<div dir="rtl" style="flex:1 1 300px; max-width:400px; font-family:'Segoe UI', sans-serif; text-align:right;">
		  <h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
			هام: إشعار بتعليق الحملة
		  </h4>
  
		  <p style="font-size:16px;line-height:1.6;">
			عزيزي/عزيزتي ${user.firstName || "المستخدم"},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			نود إبلاغك بأنه قد تم تعليق حملتك مؤقتًا <strong>${campaign.campaignName
		}</strong> من قبل الإدارة.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			خلال فترة التعليق، لن تكون الحملة مرئية للمستثمرين.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			إذا كانت لديك أي استفسارات أو تعتقد أن هذا تم عن طريق الخطأ، يرجى التواصل مع فريق الدعم للحصول على توضيح.
		  </p>
		</div>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888; line-height:1.4;">
		Best regards,<br/>
		Wadiaa CI<br/><br/>
		مع أطيب التحيات،<br/>
		فريق وديع
	  </p>
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / زيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: `Wadiaa: ${campaign.campaignName} Campaign Temporarily Suspended`,
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Suspension email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending suspension email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send suspension email.",
		};
	}
}

async function sendCampaignResumedEmail(user, campaign) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
	  <div style="text-align:center;">
		<img 
		  src="https://wadiaa.com/wadiaaLogo.png" 
		  alt="Wadiaa Logo" 
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
	  </div>
  
	  <div style="display:flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
		<!-- English Section -->
		<div style="flex:1 1 300px; max-width:400px;">
		  <h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
			Good News: Campaign Resumed
		  </h4>
  
		  <p style="font-size:16px;line-height:1.6;">
			Dear ${user.firstName || "User"},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			We’re glad to inform you that your campaign <strong>${campaign.campaignName
		}</strong> has been resumed and is now live again on the platform.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			Investors can now view and contribute to your campaign as usual.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			If you have any concerns or need assistance, feel free to reach out to our support team.
		  </p>
		</div>
  
		<!-- Arabic Section -->
		<div dir="rtl" style="flex:1 1 300px; max-width:400px; font-family:'Segoe UI', sans-serif; text-align:right;">
		  <h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
			أخبار سارة: تم استئناف الحملة
		  </h4>
  
		  <p style="font-size:16px;line-height:1.6;">
			عزيزي/عزيزتي ${user.firstName || "المستخدم"},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			يسعدنا إبلاغك بأن حملتك <strong>${campaign.campaignName
		}</strong> قد تم استئنافها وهي الآن نشطة مرة أخرى على المنصة.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			يمكن للمستثمرين الآن مشاهدة حملتك والمساهمة فيها كالمعتاد.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			إذا كانت لديك أية مخاوف أو تحتاج إلى مساعدة، لا تتردد في التواصل مع فريق الدعم لدينا.
		  </p>
		</div>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888; line-height:1.4;">
		Best regards,<br/>
		The Wadiaa Team<br/><br/>
		مع أطيب التحيات،<br/>
		فريق وديع
	  </p>
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / زيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: `Wadiaa: ${campaign.campaignName} Campaign is Live`,
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Resumption email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending resumption email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send resumption email.",
		};
	}
}

async function sendManualPaymentApprovedForInstallmentToFundraiser({
	userObj,
	emailBody,
}) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
	  <div style="text-align:center;">
		<img
		  src="https://wadiaa.com/wadiaaLogo.png"
		  alt="Wadiaa Logo"
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		/>
	  </div>
  
	  <div style="display:flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
		<!-- English Section -->
		<div style="flex:1 1 300px; max-width:400px;">
		  <h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
			Repayment Approval Notification
		  </h4>
  
		  <p style="font-size:16px;line-height:1.6;">
			Dear ${userObj.firstName || "User"} ${userObj.lastName || ""},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			We are pleased to inform you that your payment for installment no. 
			<strong>${emailBody?.matchedInstallment?.installmentNumber}</strong> 
			has been successfully verified and approved by Wadiaa.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			Amount Paid: <strong>${emailBody?.matchedInstallment?.installmentAmount
		} OMR</strong>.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			Thank you for providing the receipt.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			You can review the repayment schedule details in your account dashboard. If you have any questions or need further assistance, please do not hesitate to contact us.
		  </p>
		</div>
  
		<!-- Arabic Section -->
		<div dir="rtl" style="flex:1 1 300px; max-width:400px; font-family:'Segoe UI', sans-serif; text-align:right;">
		  <h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
			إشعار الموافقة على الدفعة
		  </h4>
  
		  <p style="font-size:16px;line-height:1.6;">
			عزيزي/عزيزتي ${userObj.firstName || "المستخدم"} ${userObj.lastName || ""},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			يسرنا إبلاغك بأنه تم التحقق من دفعتك للقسط رقم 
			<strong>${emailBody?.matchedInstallment?.installmentNumber}</strong> 
			وتمت الموافقة عليها من قبل وديع.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			المبلغ المدفوع: <strong>${emailBody?.matchedInstallment?.installmentAmount
		} ريال عماني</strong>.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			شكرًا لتقديمك إيصال الدفع.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			يمكنك مراجعة تفاصيل جدول السداد في لوحة التحكم بحسابك. إذا كان لديك أي استفسارات أو تحتاج إلى مساعدة إضافية، فلا تتردد في الاتصال بنا.
		  </p>
		</div>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888; line-height:1.4;">
		Best regards,<br/>
		The Wadiaa Team<br/><br/>
		مع أطيب التحيات،<br/>
		فريق وديع
	  </p>
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / زيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: userObj.email,
			subject: `Wadiaa: ${emailBody?.campaignName} Repayment Approval Success`,
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Repayment approval email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending repayment email:", error);
		return { status: false, code: 500, msg: "Failed to send repayment email." };
	}
}

async function sendROIToInvestor({ userObj, emailBody }) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
  
	  <!-- English Section -->
	  <div style="direction:ltr;text-align:left;">
		<div style="text-align:center;">
		  <img
			src="https://wadiaa.com/wadiaaLogo.png"
			alt="Wadiaa Logo"
			style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		  />
		</div>
  
		<h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
		  Return on Investment Notification
		</h4>
  
		<p style="font-size:16px;line-height:1.6;">
		  Dear ${userObj.firstName || "User"} ${userObj.lastName || ""},
		</p>
  
		<p style="font-size:16px;line-height:1.6;">
		  We are pleased to inform you that your investment return for the campaign
		  "<strong>${emailBody?.campaignName}</strong>" has been successfully processed.
		</p>
  
		<p style="font-size:16px;line-height:1.6;">
		  <strong>Investment Summary:</strong>
		</p>
  
		<ul style="font-size:16px;line-height:1.6;padding-left:20px;">
		  <li>Campaign Name: ${emailBody?.campaignName}</li>
		  <li>Principal Amount: ${to3(emailBody?.principalAmount)} OMR</li>
		  <li>Profit Earned: ${to3(emailBody?.interestAmount)} OMR</li>
		  <li>Total Amount Returned: ${to3(emailBody?.totalAmount)} OMR</li>
		</ul>
  
		<p style="font-size:16px;line-height:1.6;">
		  Thank you for supporting "<strong>${emailBody?.campaignName
		}</strong>". Your contribution has made a significant impact, and we look forward to partnering with you again in future opportunities.
		</p>
  
		<p style="font-size:16px;line-height:1.6;">
		  If you have any questions or need further assistance, please do not hesitate to contact us.
		</p>
	  </div>
  
	  <hr style="margin:40px 0;border:none;border-top:2px solid #184274;" />
  
	  <!-- Arabic Section -->
	  <div style="direction:rtl;text-align:right;">
		<div style="text-align:center;">
		  <img
			src="https://wadiaa.com/wadiaaLogo.png"
			alt="شعار وديعة"
			style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;"
		  />
		</div>
  
		<h4 style="color:#184274;font-size:22px;margin-bottom:20px;">
		  إشعار عائد الاستثمار
		</h4>
  
		<p style="font-size:16px;line-height:1.6;">
		  عزيزي/عزيزتي ${userObj.firstName || "المستخدم"} ${userObj.lastName || ""},
		</p>
  
		<p style="font-size:16px;line-height:1.6;">
		  يسرنا إبلاغكم بأن عائد استثماركم لحملة
		  "<strong>${emailBody?.campaignName}</strong>" قد تم معالجته بنجاح.
		</p>
  
		<p style="font-size:16px;line-height:1.6;">
		  <strong>ملخص الاستثمار:</strong>
		</p>
  
		<ul style="font-size:16px;line-height:1.6;padding-right:20px;">
		  <li>اسم الحملة: ${emailBody?.campaignName}</li>
		  <li>المبلغ الأصلي: ${to3(emailBody?.principalAmount)} ريال عماني</li>
		  <li>الفائدة المكتسبة: ${to3(emailBody?.interestAmount)} ريال عماني</li>
		  <li>إجمالي المبلغ المرتجع: ${to3(emailBody?.totalAmount)} ريال عماني</li>
		</ul>
  
		<p style="font-size:16px;line-height:1.6;">
		  شكرًا لدعمكم لحملة "<strong>${emailBody?.campaignName
		}</strong>". لقد كان لمساهمتكم أثر كبير، ونتطلع إلى التعاون معكم مجددًا في فرص مستقبلية.
		</p>
  
		<p style="font-size:16px;line-height:1.6;">
		  إذا كان لديكم أي أسئلة أو تحتاجون إلى مساعدة إضافية، لا تترددوا في التواصل معنا.
		</p>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888; text-align:left;">
  		Best regards,<br/>
  		The Wadiaa Team
	</p>

	<p dir="rtl" style="font-size:14px;color:#888; text-align:right;">
  		مع أطيب التحيات،<br/>
  		فريق وديعة
	</p>
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: userObj.email,
			subject: `Investment Return Processed for "${emailBody?.campaignName}"`,
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "ROI email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending ROI email:", error);
		return { status: false, code: 500, msg: "Failed to send ROI email." };
	}
}

async function sendRepaymentUpdateEmailForFundraiser(user, campaignName) {
	const campaignText = campaignName
		? `the ${campaignName} campaign`
		: "your current campaign";

	const campaignTextArabic = campaignName
		? `حملة ${campaignName}`
		: "حملتك الحالية";

	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
  
	  <!-- English Section -->
	  <div style="direction:ltr;text-align:left;">
		<p style="font-size:16px;line-height:1.6;">
		  Dear ${user.firstName || "User"},
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  We wanted to let you know that your repayment schedule for ${campaignText} has been successfully updated.
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  You can review the updated repayment schedule details in your account dashboard. If you have any questions or require assistance, please feel free to reach out to us.
		</p>
	  </div>
  
	  <hr style="margin:40px 0;border:none;border-top:2px solid #184274;" />
  
	  <!-- Arabic Section -->
	  <div style="direction:rtl;text-align:right;">
		<p style="font-size:16px;line-height:1.6;">
		  عزيزي/عزيزتي ${user.firstName || "المستخدم"},
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  نود إبلاغكم بأنه تم تحديث جدول السداد الخاص بـ ${campaignTextArabic} بنجاح.
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  يمكنكم مراجعة تفاصيل جدول السداد المحدث في لوحة حسابكم. إذا كان لديكم أي استفسارات أو تحتاجون إلى مساعدة، لا تترددوا في التواصل معنا.
		</p>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888; text-align:left;">
  		Best regards,<br/>
  		The Wadiaa Team
	</p>

	<p dir="rtl" style="font-size:14px;color:#888; text-align:right;">
  		مع أطيب التحيات،<br/>
  		فريق وديعة
	</p>
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: "Wadiaa: Repayment Schedule Updated Successfully",
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Repayment schedule update email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending repayment update email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send repayment update email.",
		};
	}
}

async function sendRepaymentRejectedEmailForFundraiser(user, remark) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
  
	  <!-- English Section -->
	  <div style="direction:ltr;text-align:left;">
		<p style="font-size:16px;line-height:1.6;">
		  Dear ${user.firstName || "User"},
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  We regret to inform you that your payment verification request has been rejected due to the following reason:
		</p>
		<blockquote style="background:#f2f2f2;border-left:4px solid #d9534f;padding:10px 15px;margin:15px 0;color:#a94442;">
		  ${remark}
		</blockquote>
		<p style="font-size:16px;line-height:1.6;">
		  We kindly request you to review your receipt and submit the request again. If you require assistance, please feel free to contact our support team.
		</p>
	  </div>
  
	  <hr style="margin:40px 0;border:none;border-top:2px solid #d9534f;" />
  
	  <!-- Arabic Section -->
	  <div style="direction:rtl;text-align:right;">
		<p style="font-size:16px;line-height:1.6;">
		  عزيزي/عزيزتي ${user.firstName || "المستخدم"},
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  نأسف لإبلاغكم بأن طلب التحقق من الدفع الخاص بكم قد تم رفضه بسبب السبب التالي:
		</p>
		<blockquote style="background:#f2f2f2;border-right:4px solid #d9534f;padding:10px 15px;margin:15px 0;color:#a94442;">
		  ${remark}
		</blockquote>
		<p style="font-size:16px;line-height:1.6;">
		  نرجو منكم مراجعة الإيصال الخاص بكم وإعادة تقديم الطلب مرة أخرى. إذا كنتم بحاجة إلى مساعدة، لا تترددوا في التواصل مع فريق الدعم لدينا.
		</p>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888; text-align:left;">
		Best regards,<br/>
		The Wadiaa Team
	</p>

	<p dir="rtl" style="font-size:14px;color:#888; text-align:right;">
		مع أطيب التحيات،<br/>
		فريق وديعة
	</p>

  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#d9534f;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: "Wadiaa: Payment Verification Request Rejected",
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Repayment rejection email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending repayment rejection email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send repayment rejection email.",
		};
	}
}

async function sendRepaymentRefundedEmailForFundraiser(user, remark) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
  
	  <!-- English Section -->
	  <div style="direction:ltr;text-align:left;">
		<p style="font-size:16px;line-height:1.6;">
		  Dear ${user.firstName || "User"},
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  We regret to inform you that your payment verification request has been refunded due to the following reason:
		</p>
		<blockquote style="background:#f2f2f2;border-left:4px solid #f0ad4e;padding:10px 15px;margin:15px 0;color:#8a6d3b;">
		  ${remark}
		</blockquote>
		<p style="font-size:16px;line-height:1.6;">
		  We kindly request you to review your receipt and submit the request again. If you require assistance, please feel free to contact our support team.
		</p>
	  </div>
  
	  <hr style="margin:40px 0;border:none;border-top:2px solid #f0ad4e;" />
  
	  <!-- Arabic Section -->
	  <div style="direction:rtl;text-align:right;">
		<p style="font-size:16px;line-height:1.6;">
		  عزيزي/عزيزتي ${user.firstName || "المستخدم"},
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  نأسف لإبلاغكم بأن طلب التحقق من الدفع الخاص بكم قد تم إرجاع المبلغ له بسبب السبب التالي:
		</p>
		<blockquote style="background:#f2f2f2;border-right:4px solid #f0ad4e;padding:10px 15px;margin:15px 0;color:#8a6d3b;">
		  ${remark}
		</blockquote>
		<p style="font-size:16px;line-height:1.6;">
		  نرجو منكم مراجعة الإيصال الخاص بكم وإعادة تقديم الطلب مرة أخرى. إذا كنتم بحاجة إلى مساعدة، لا تترددوا في التواصل مع فريق الدعم لدينا.
		</p>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p style="font-size:14px;color:#888; text-align:left;">
		Best regards,<br/>
		The Wadiaa Team
	</p>

	<p dir="rtl" style="font-size:14px;color:#888; text-align:right;">
		مع أطيب التحيات،<br/>
		فريق وديعة
	</p>

  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#f0ad4e;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: "Wadiaa: Payment Verification Request Refunded",
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Repayment refund email has been sent successfully.",
		};
	} catch (error) {
		console.error("Error sending repayment refund email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send repayment refund email.",
		};
	}
}

async function sendInstallmentPaymentEmail(
	fundraiser,
	campaignName,
	repayment
) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
  
	  <!-- English Section -->
	  <div style="direction:ltr;text-align:left;">
		<p style="font-size:16px;line-height:1.6;">
		  Dear ${fundraiser.firstName || "User"},
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  We are pleased to inform you that your installment payment for the campaign 
		  <strong>${campaignName}</strong> has been successfully processed.
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  <strong>Payment Details:</strong>
		</p>
		<ul style="font-size:16px;line-height:1.6;padding-left:20px;">
		  <li><strong>Installment Amount Paid:</strong> ${repayment.installmentAmount.toFixed(
		3
	)} OMR</li>
		  <li><strong>Remaining Principal Amount:</strong> ${repayment.remainingAmount.toFixed(
		3
	)} OMR</li>
		  <li><strong>Payment Date:</strong> ${new Date(
		repayment.paidOn
	).toLocaleString()}</li>
		</ul>
		<p style="font-size:16px;line-height:1.6;">
		  You can view the updated repayment schedule in your account dashboard. If you have any questions, feel free to contact our support team.
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  Thank you for your continued commitment.
		</p>
		<p style="font-size:14px;color:#888; text-align:left;">
			Best regards,<br/>
			The Wadiaa Team
		</p>

	  </div>
  
	  <hr style="margin:40px 0;border:none;border-top:2px solid #184274;" />
  
	  <!-- Arabic Section -->
	  <div style="direction:rtl;text-align:right;">
		<p style="font-size:16px;line-height:1.6;">
		  عزيزي/عزيزتي ${fundraiser.firstName || "المستخدم"},
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  يسرنا إبلاغكم بأن دفعة القسط الخاصة بكم للحملة
		  <strong>${campaignName}</strong> قد تمت معالجتها بنجاح.
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  <strong>تفاصيل الدفع:</strong>
		</p>
		<ul style="font-size:16px;line-height:1.6;padding-right:20px;">
		  <li><strong>مبلغ القسط المدفوع:</strong> ${repayment.installmentAmount.toFixed(
		3
	)} ريال عماني</li>
		  <li><strong>المبلغ المتبقي من الأصل:</strong> ${repayment.remainingAmount.toFixed(
		3
	)} ريال عماني</li>
		  <li><strong>تاريخ الدفع:</strong> ${new Date(
		repayment.paidOn
	).toLocaleString()}</li>
		</ul>
		<p style="font-size:16px;line-height:1.6;">
		  يمكنك عرض جدول السداد المحدث في لوحة حسابك. إذا كان لديك أي أسئلة، يرجى التواصل مع فريق الدعم لدينا.
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  نشكركم على التزامكم المستمر.
		</p>
		<p dir="rtl" style="font-size:14px;color:#888; text-align:right;">
			مع أطيب التحيات،<br/>
			فريق وديعة
		</p>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: fundraiser.email,
			subject: `Wadiaa: Installment Payment Success - ${campaignName}`,
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Installment payment confirmation email sent successfully.",
		};
	} catch (error) {
		console.error("Error sending installment payment email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send installment payment email.",
		};
	}
}

async function sendInvestmentCanceledToCampaignOwner({
	user,
	campaignName,
	investmentAmount,
	currency,
}) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
  
	  <!-- English Section -->
	  <div style="direction:ltr;text-align:left;">
		<p style="font-size:16px;line-height:1.6;">
		  Dear ${user.firstName || "User"} ${user.lastName || ""},
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  We regret to inform you that an investment of amount <strong>${investmentAmount} ${currency}</strong> in your campaign "<strong>${campaignName}</strong>" has been canceled.
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  If you have any questions or need further assistance, please feel free to reach out.
		</p>
	  </div>
  
	  <hr style="margin:40px 0;border:none;border-top:2px solid #d9534f;" />
  
	  <!-- Arabic Section -->
	  <div style="direction:rtl;text-align:right;">
		<p style="font-size:16px;line-height:1.6;">
		  عزيزي/عزيزتي ${user.firstName || "المستخدم"} ${user.lastName || ""},
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  نأسف لإبلاغكم أنه تم إلغاء استثمار بمبلغ <strong>${investmentAmount} ${currency}</strong> في حملتكم "<strong>${campaignName}</strong>".
		</p>
		<p style="font-size:16px;line-height:1.6;">
		  إذا كانت لديكم أي أسئلة أو كنتم بحاجة إلى مزيد من المساعدة، يرجى التواصل معنا بحرية.
		</p>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <p dir="ltr" style="font-size:14px;color:#888;text-align:left;">
		Best regards
		The Wadiaa Team
	  </p>
	  <p dir="rtl" style="font-size:14px;color:#888; text-align:right;">
			مع أطيب التحيات،<br/>
			فريق وديعة
		</p>
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#d9534f;color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / قم بزيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: `Wadiaa: ${campaignName} Campaign Investment Canceled`,
			html: `${message}`,
		});

		return {
			status: true,
			code: 200,
			data: "Campaign owner notified successfully.",
		};
	} catch (error) {
		console.error(
			"Error sending investment canceled email to campaign owner:",
			error
		);
		return {
			status: false,
			code: 500,
			msg: "Failed to send campaign owner notification email.",
		};
	}
}

async function sendCampaignRegistrationFeeEmailToAdmin({
	admin,
	user,
	campaignDetails,
}) {
	const campaignStartDate = moment(campaignDetails?.campaignStartDate).format(
		"lll"
	);
	const campaignEndDate = moment(campaignDetails?.campaignEndDate).format(
		"lll"
	);

	const message = `
	  <div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
	
		<!-- English Section -->
		<div style="direction:ltr;text-align:left;">
		  <p style="font-size:16px;line-height:1.6;">
			Dear ${admin.firstName || "Admin"} ${admin.lastName || ""},
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			We would like to inform you that <strong>${user.firstName || ""} ${user.lastName || ""
		}</strong> has successfully paid the registration fee of <strong>${campaignDetails?.campaignRegistrationFee
		} ${campaignDetails?.currency}</strong> for their campaign "<strong>${campaignDetails?.campaignName
		}</strong>".
		  </p>
		  <p style="font-size:16px;line-height:1.6;font-weight:bold;">
			We have received the payment of ${campaignDetails?.campaignRegistrationFee} ${campaignDetails?.currency
		}. Campaign is now officially live and will run from ${campaignStartDate} to ${campaignEndDate}.
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			Please review the campaign details and take any necessary actions.
		  </p>
		</div>
	
		<hr style="margin:40px 0;border:none;border-top:2px solid #184274;" />
	
		<!-- Arabic Section -->
		<div style="direction:rtl;text-align:right;">
		  <p style="font-size:16px;line-height:1.6;">
			عزيزي/عزيزتي ${admin.firstName || "المسؤول"} ${admin.lastName || ""},
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			نود إبلاغكم بأن <strong>${user.firstName || ""} ${user.lastName || ""
		}</strong> قد قام بدفع رسوم التسجيل بقيمة <strong>${campaignDetails?.campaignRegistrationFee
		} ${campaignDetails?.currency}</strong> لحملته "<strong>${campaignDetails?.campaignName
		}</strong>" بنجاح.
		  </p>
		  <p style="font-size:16px;line-height:1.6;font-weight:bold;">
			لقد تم استلام المبلغ وقد أصبحت الحملة رسمياً نشطة وستستمر من ${campaignStartDate} إلى ${campaignEndDate}.
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			يرجى مراجعة تفاصيل الحملة واتخاذ الإجراءات اللازمة.
		  </p>
		</div>
	
		<hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
	
		<p dir="ltr" style="font-size:14px;color:#888;text-align:left;">
		Best regards
		The Wadiaa Team
	  </p>
	  <p dir="rtl" style="font-size:14px;color:#888; text-align:right;">
			مع أطيب التحيات،<br/>
			فريق وديعة
		</p>
	
		<div style="text-align:center;margin-top:30px;">
		  <a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
			Visit Our Website / قم بزيارة موقعنا
		  </a>
		</div>
	  </div>
	`;

	try {
		await sendEmail({
			to: admin.email,
			subject: `Wadiaa: ${campaignDetails?.campaignName} Campaign Fee Payment Success`,
			html: `${message}`,
		});
		return { status: true, code: 200, data: "Admin notified successfully." };
	} catch (error) {
		console.error(
			"Error sending campaign registration fee email to admin:",
			error
		);
		return {
			status: false,
			code: 500,
			msg: "Failed to send admin notification email.",
		};
	}
}

async function sendCampaignRegistrationFeeEmailToFundraiser({
	user,
	campaignDetails,
}) {
	const campaignStartDate = moment(campaignDetails?.campaignStartDate).format(
		"lll"
	);
	const campaignEndDate = moment(campaignDetails?.campaignEndDate).format(
		"lll"
	);

	const message = `
	  <div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;font-family:'Segoe UI', sans-serif;color:#333;">
	
		<!-- English Section -->
		<div style="direction:ltr;text-align:left;">
		  <p style="font-size:16px;line-height:1.6;">
			Dear ${user.firstName || "User"} ${user.lastName || ""},
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			We are pleased to inform you that your registration fee of 
			<strong>${campaignDetails?.campaignRegistrationFee} ${campaignDetails?.currency
		}</strong> 
			for the campaign "<strong>${campaignDetails?.campaignName
		}</strong>" has been successfully received.
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			Your campaign is now officially live and will run from 
			<strong>${campaignStartDate}</strong> to <strong>${campaignEndDate}</strong>.
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			Thank you for choosing our platform. If you have any questions or need assistance, feel free to contact us.
		  </p>
		  <p dir="ltr" style="font-size:14px;color:#888;text-align:left;">
		Best regards
		The Wadiaa Team
	  </p>
		</div>
	
		<hr style="margin:40px 0;border:none;border-top:2px solid #184274;" />
	
		<!-- Arabic Section -->
		<div style="direction:rtl;text-align:right;">
		  <p style="font-size:16px;line-height:1.6;">
			عزيزي/عزيزتي ${user.firstName || "المستخدم"} ${user.lastName || ""},
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			يسرنا إبلاغكم بأنه تم استلام رسوم التسجيل الخاصة بكم 
			<strong>${campaignDetails?.campaignRegistrationFee} ${campaignDetails?.currency
		}</strong> 
			للحملة "<strong>${campaignDetails?.campaignName}</strong>" بنجاح.
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			أصبحت حملتكم رسمياً نشطة وستستمر من 
			<strong>${campaignStartDate}</strong> إلى <strong>${campaignEndDate}</strong>.
		  </p>
		  <p style="font-size:16px;line-height:1.6;">
			شكراً لاختياركم منصتنا. إذا كان لديكم أي أسئلة أو تحتاجون إلى مساعدة، لا تترددوا في التواصل معنا.
		  </p>
		  <p dir="rtl" style="font-size:14px;color:#888; text-align:right;">
		  مع أطيب التحيات،<br/>
		  فريق وديعة
	  </p>
		</div>
	
		<hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
	
		<div style="text-align:center;margin-top:30px;">
		  <a href="https://wadiaa.com" style="display:inline-block;padding:10px 20px;background:#184274;color:#fff;text-decoration:none;border-radius:6px;">
			Visit Our Website / قم بزيارة موقعنا
		  </a>
		</div>
	
	  </div>
	`;

	try {
		await sendEmail({
			to: user.email,
			subject: "Campaign Registration Successful",
			html: `${message}`,
		});
		return {
			status: true,
			code: 200,
			data: "Fundraiser notified successfully.",
		};
	} catch (error) {
		console.error(
			"Error sending campaign registration email to fundraiser:",
			error
		);
		return {
			status: false,
			code: 500,
			msg: "Failed to send fundraiser notification email.",
		};
	}
}

async function sendEmailToFundraiserCheckCampaignTargetRaised({
	userDetails,
	emailSubject,
	emailTemplateMessage,
}) {
	try {
		await sendEmail({
			to: userDetails.email,
			subject: `${emailSubject}`,
			html: `${emailTemplateMessage}`,
		});

		return {
			status: true,
			code: 200,
			data: "Fundraiser notified successfully.",
		};
	} catch (error) {
		console.error("Error sending campaign status update email:", error);
		return {
			status: false,
			code: 500,
			msg: "Failed to send fundraiser notification email.",
		};
	}
}

async function sendEmailToAdminCheckCampaignTargetRaised({
	admin,
	adminEmailSubject,
	adminEmailTemplateMessage,
}) {
	try {
		await sendEmail({
			to: admin.email,
			subject: `${adminEmailSubject}`,
			html: `${adminEmailTemplateMessage}`,
		});

		return { status: true, code: 200, data: "Admin notified successfully." };
	} catch (error) {
		console.error(
			"Error sending campaign status update email to admin:",
			error
		);
		return {
			status: false,
			code: 500,
			msg: "Failed to send admin notification email.",
		};
	}
}

async function sendInvestmentCanceledToInvestor({
	user,
	campaignName,
	investmentAmount,
	currency,
}) {
	const message = `
	<div style="width:100%;padding:20px;background:#f9f9f9;border-radius:8px;
				font-family:'Segoe UI', sans-serif;color:#333;">
	  
	  <div style="text-align:center;">
		<img 
		  src="https://wadiaa.com/wadiaaLogo.png" 
		  alt="Wadiaa Logo" 
		  style="display:block;margin:0 auto 20px;width:60%;max-width:60%;height:auto;" 
		/>
	  </div>
  
	  <div style="display:flex; flex-wrap: wrap; gap: 30px; justify-content: center;">
		<!-- English Section -->
		<div style="flex:1 1 300px; max-width:400px;">
		  <p style="font-size:16px;line-height:1.6;">
			Dear ${user.firstName} ${user.lastName},
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			Your investment of amount <strong>${investmentAmount} ${currency}</strong> 
			in the campaign "<strong>${campaignName}</strong>" has been successfully canceled.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			If you have any questions or need further assistance, please feel free to reach out.
		  </p>
  
			<p style="font-size:14px; color:#888; text-align:left;">
				Best regards,<br/>
				The Wadiaa Team
			</p>

		</div>
  
		<!-- Arabic Section -->
		<div dir="rtl" style="flex:1 1 300px; max-width:400px; text-align:right;">
		  <p style="font-size:16px;line-height:1.6;">
			عزيزي/عزيزتي ${user.firstName} ${user.lastName}،
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			تم إلغاء استثمارك بمبلغ 
			<strong>${investmentAmount} ${currency}</strong> 
			في الحملة "<strong>${campaignName}</strong>" بنجاح.
		  </p>
  
		  <p style="font-size:16px;line-height:1.6;">
			إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة إضافية، فلا تتردد في التواصل معنا.
		  </p>
  
		  <!-- Arabic -->
			<p dir="rtl" style="font-size:14px; color:#888; text-align:right;">
				مع أطيب التحيات،<br/>
				فريق وديعة
			</p>
		</div>
	  </div>
  
	  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
  
	  <div style="text-align:center;margin-top:30px;">
		<a href="https://wadiaa.com" 
		   style="display:inline-block;padding:10px 20px;background:#184274;
				  color:#fff;text-decoration:none;border-radius:6px;">
		  Visit Our Website / زيارة موقعنا
		</a>
	  </div>
	</div>
  `;

	try {
		await sendEmail({
			to: user.email,
			subject: `Wadiaa Update: ${campaignName} Campaign Investment Canceled`,
			html: `${message}`,
		});

		return { status: true, code: 200, data: "Investor notified successfully." };
	} catch (error) {
		console.error(
			"Error sending investment canceled email to investor:",
			error
		);
		return {
			status: false,
			code: 500,
			msg: "Failed to send investor notification email.",
		};
	}
}

module.exports = {
	sendWelcomeEmailToUser,
	sendVerificationEmail,
	sendForgotPasswordEmail,
	sendRepaymentEmailForFundraiser,
	sendOtpEmail,
	sendRepaymentUpdateEmailForFundraiser,
	sendRepaymentRejectedEmailForFundraiser,
	sendRepaymentRefundedEmailForFundraiser,
	sendManualPaymentApprovedForInstallmentToFundraiser,
	sendROIToInvestor,
	sendInstallmentPaymentEmail,
	sendSignupEmailForBackofficeUsers,
	signInvestmentContractEmailOtp,
	sendInvestmentCanceledToCampaignOwner,
	sendInvestmentCanceledToInvestor,
	sendCampaignRegistrationFeeEmailToAdmin,
	sendCampaignRegistrationFeeEmailToFundraiser,
	sendCampaignRegistrationFeeReminder,
	sendEmailToFundraiserCheckCampaignTargetRaised,
	sendEmailToAdminCheckCampaignTargetRaised,
	accountLockedMail,
	sendFeedBackEmailByUser,
	sendOtpAccountVerification,
	sendCampaignSuspendedEmail,
	sendCampaignResumedEmail,
};
