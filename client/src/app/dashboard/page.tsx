
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardRedirectPage = async () => {
  const user = await currentUser();

  if (!user) {

    redirect("/sign-in");
  }

  const role = user.publicMetadata?.role as string;


  if (role === "manager") {
    redirect("/manager");
  } else if (role === "tenant") {
    redirect("/tenants");
  } else {

    redirect("/select-role");
  }


  return null;
};

export default DashboardRedirectPage;