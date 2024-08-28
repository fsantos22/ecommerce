import * as nodemailer from 'nodemailer'

type SendMailProps = {
  subject: string
  to: string
  text?: string
  html?: string
}

export async function sendMail(props: SendMailProps): Promise<void> {
  const { subject, to, text, html } = props
  const transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL as string,
      pass: process.env.NODEMAILER_PW as string,
    },
  })

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL as string,
    to,
    subject,
    text,
    html,
  }

  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err)
        } else {
          console.log('Email sent:', info.response)
          resolve(info)
        }
      })
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error(error as any)
  }
}
