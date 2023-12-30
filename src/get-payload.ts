import dotenv from "dotenv";
import path from "path";
import payload, { Payload } from "payload";
import type { InitOptions } from "payload/config";
import nodemailer from "nodemailer";

// get path of the .env file
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Setuping nodemailer to send emails via resend
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

// cache data
let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing");
  }

  //   if client cache exist return the value
  if (cached.client) {
    return cached.client;
  }

  //   if promise does not exist
  if (!cached.promise) {
    // initialie payload
    cached.promise = payload.init({
      email: {
        transport: transporter,
        fromAddress: "noreply@frontendroadmap.com",
        fromName: "Digital Hippo",
      },
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true, // start payload in local mode if there's express server
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (error: unknown) {
    cached.promise = null;
    throw error;
  }

  return cached.client;
};
