import express from 'express';
import { PrismaClient } from '@prisma/client';
// import { Resend } from 'resend';
import nodemailer from "nodemailer";
import 'dotenv/config'
import cors from "cors"
const prisma = new PrismaClient();
const app = express();

// const resend = new Resend("re_RhAQ3oGq_DdVqbHiS6BnQoohbynreXFTG");

app.use(cors())
app.use(express.json());

type Referral = {
  id: number;
  referrerName: string;
  referrerEmail: string;
  refereeName: string;
  refereeEmail: string;
  course: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
};



app.post('/referral', async (req, res) => {
  const referral = req.body as Referral;

  if(!referral){
    res.status(404).json({"Message":"please input all the fields"});
  }
  // console.log(referral);
  try {
    const newReferral = await prisma.referral.create({
      data: {
        referrerName: referral.referrerName,
        referrerEmail: referral.referrerEmail,
        refereeName: referral.refereeName,
        refereeEmail: referral.refereeEmail,
        course: referral.course,
        message: referral.message,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      service:'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"Aditya Kale <co.2021.askale@bitwardha.ac.in>', 
      to: referral.referrerEmail, 
      subject: "you have Successfully referred your friend", 
      text: "This referrel has been done succefully just view the website for gitfts", 
      html: `<h1>Go to Official website for rewards</h1>
              <a href="www.google.com">get a reward<a/>
      `, 
    });
    // console.log(info);
    // console.log("reached here");
    
    res.status(200).json({"Message":"successfully Data submitted","Data":newReferral,info});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.SERVER_PORT}`);
});

