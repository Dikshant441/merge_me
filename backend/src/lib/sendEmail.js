import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js";


const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      Body: { 
        Html: {
          Charset: "UTF-8",
          Data: `<div class="container" style="font-family: sans-serif;"><h1 style="color: #333; font-size: 1.5em;">Hello, Welcome to Merge me!</h1><p style="color: #666; font-size: 1.1em;">Thank you for joining Merge me. Please click on the button below to verify your email address.</p><a href="${link}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a><p style="color: #999; font-size: 0.9em;">This link will expire in 15 minutes.</p></div>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `Hello, Welcome to Merge me! Thank you for joining Merge me. Please click on the button below to verify your email address. This link will expire in 15 minutes.`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Verify your email address | Merge Me",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    "recipient@example.com",
    "sender@example.com",
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
export { run };