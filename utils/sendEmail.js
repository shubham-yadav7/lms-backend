import nodemailer from "nodemailer";
import ErrorHandler from "./ErrorHandler.js";

export const sendEmail = async (data) => {
  try{
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
  
    transporter.verify((err, res) => {
      if (err) {
        console.log("Nodemailer error: ", err);
      }
      console.log("Server is ready to take our messages");
    });
  
    let info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      ...data,
    });
    return info;
  }catch(err){
    console.log("Error sending emails", err);
    throw new Error("Email failed to send.");
  }
};