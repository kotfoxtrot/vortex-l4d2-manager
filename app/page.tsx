import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="dark flex min-h-screen flex-col items-center justify-cneter p-24 text-otext gap-8">
      <div>
        <Link href="/manager"><Button>Перейти в редактор пользователей</Button></Link>
      </div>
      <div>
        <Link href="/logs"><Button>Просмотр логов чата</Button></Link>
      </div>
    </main>
  );
}
