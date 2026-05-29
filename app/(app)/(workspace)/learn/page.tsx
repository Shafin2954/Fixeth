import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveEnrollment } from "@/lib/supabase/queries/enrollments-server";
import { getFirstLessonIdForTrack } from "@/lib/supabase/queries/modules";

export default async function LearnIndexPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const enrollment = await getActiveEnrollment(user.id);
  if (enrollment?.current_lesson_id) {
    redirect(`/learn/${enrollment.current_lesson_id}`);
  }
  if (enrollment?.track_id) {
    const first = await getFirstLessonIdForTrack(enrollment.track_id);
    if (first) redirect(`/learn/${first}`);
  }

  redirect("/dashboard");
}
