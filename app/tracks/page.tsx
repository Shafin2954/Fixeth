import { redirect } from "next/navigation";

/** Legacy public path → authenticated track library */
export default function PublicTracksRedirect() {
  redirect("/tracks");
}
