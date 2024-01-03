import dotenv from "dotenv";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { buildConfig } from "payload/config";
import { Users } from "./payload/collections/users";
import { Products } from "./payload/collections/products/products";
import { Media } from "./payload/collections/media";
import { ProductFile } from "./payload/collections/products/productFile";
import { Orders } from "./payload/collections/orders";

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

export default buildConfig({
  admin: {
    user: "users", // Use the user collection when logging to admin
    bundler: webpackBundler(),
    // meta data for the admin dashboard
    meta: {
      titleSuffix: "- DigitalHippo",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg",
    },
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [Users, Products, Media, ProductFile, Orders],
  routes: {
    // set the routing of admin panel to "/sell" instead of default "/admin"
    admin: "/sell",
  },
  editor: slateEditor({}), // using SlateEditor as a rich text editor
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),
  rateLimit: {
    max: 1000,
  },
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
});
