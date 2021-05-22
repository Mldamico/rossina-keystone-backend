import 'dotenv/config';
import {
  createTransport,
  getTestMessageUrl,
  SentMessageInfo,
} from 'nodemailer';

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string) {
  return `
    <div style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Saludos!</h2>
      <p>${text}</p>
      <p>©️, Lenceria Rossina</p>
    </div>
  `;
}

type MailResponse = {
  accepted?: string[] | null;
  rejected?: string[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: {
    from: string;
    to?: string[] | null;
  };
  messageId: string;
};

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  const info = (await transport.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Lenceria Rossina Reset Token!',
    html: makeANiceEmail(`Usted solicito recuperar la contraseña de su cuenta en Lenceria Rossina.
      <a href="${process.env.FRONTEND_URL}/auth/reset?token=${resetToken}">Click aqui para recuperar contraseña.</a>
    `),
  })) as MailResponse;

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    /* eslint no-console: 0 */
    console.log(
      `📬 Message Sent! Preview it at ${getTestMessageUrl(
        info as SentMessageInfo
      )}`
    );
  }
}
