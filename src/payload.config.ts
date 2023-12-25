import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { buildConfig } from "payload/config";

export default buildConfig({
  admin: {
    bundler: webpackBundler(),
    // meta data for the admin dashboard
    meta: {
      titleSuffix: "- DigitalHippo",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg",
    },
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [],
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
