import nodemailer from "nodemailer"
import "dotenv/config"
import { log } from "console";

const { UKR_NET_PASSWORD, UKR_NET_FROM } = process.env;

const nodeMailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_FROM,
        pass: UKR_NET_PASSWORD,
    },
};

const transport = nodemailer.createTransport(nodeMailerConfig);

const sendEmail = data => {
    const email = { ...data, from: UKR_NET_FROM };
    return transport.sendMail(email);
};

export default sendEmail;
