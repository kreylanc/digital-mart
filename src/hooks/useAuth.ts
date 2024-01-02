import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      // fetch the Payload logout API to safely delete the token to log out user
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      // if fetch failed throw an error
      if (!res.ok) throw new Error();

      // show toast if successfull
      toast.success("Signed out successfully.");

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Could not sign out. Please try again later.");
    }
  };

  return { signOut };
};
