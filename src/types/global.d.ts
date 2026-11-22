declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "nodemailer" {
  interface MailOptions {
    from: string;
    to: string;
    replyTo?: { name: string; address: string };
    subject: string;
    html: string;
  }

  interface Transporter {
    sendMail(options: MailOptions): Promise<unknown>;
  }

  const nodemailer: {
    createTransport(options: {
      host: string | undefined;
      port: number;
      secure: boolean;
      auth: { user: string | undefined; pass: string | undefined };
    }): Transporter;
  };
  export default nodemailer;
}
