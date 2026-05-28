import { redirect } from "next/navigation";
import { DEFAULT_LESSON_ID } from "@/lib/course/constants";

export default function LearnIndexPage() {
  redirect(`/learn/${DEFAULT_LESSON_ID}`);
}
