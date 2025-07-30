import { redirect } from "next/navigation";

export default function Home() {
  // 重定向到Marketing页面
  redirect("/marketing");
}
