import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export default function Home() {
  return (
    <main className="dark flex min-h-screen flex-col items-center justify-between p-24 text-otext">
      <div>
        <Link href="manager"><Button>Перейти в редактор пользователей</Button></Link>
      </div>
    </main>
  );
}
