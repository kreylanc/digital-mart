import VerifyEmail from "@/components/VerifyEmail";
import Image from "next/image";

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const VerifyEmailPage = ({ searchParams }: PageProps) => {
  const token = searchParams.token; // get the token value from the url
  const toEmail = searchParams.to; // get the email value from the url

  return (
    <div className="container relative flex pt-20 items-center justify-center lg:px-0">
      <div className="flex flex-col w-full mx-auto space-y-6 sm:w-[350px]">
        {token && typeof token === "string" ? (
          <VerifyEmail token={token} />
        ) : (
          <div className="flex flex-col h-full items-center">
            <div className="relative h-60 w-60 mb-4 text-muted-foreground">
              <Image
                src="/hippo-email-sent.png"
                alt="hippo email sent image"
                fill
              />
            </div>
            <h3 className="font-semibold text-2xl">Check your email.</h3>
            <p className="text-muted-foreground mt-2 text-center">
              We&apos;ve sent a verification link to{" "}
              {toEmail ? (
                <span className="font-semibold">{toEmail}.</span>
              ) : (
                "your email."
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
