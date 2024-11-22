import { IconArrowLeft } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Link } from "next-view-transitions";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="flex justify-between items-center px-2 py-8">
        <Link href="/blog" className="flex space-x-2 items-center">
          <IconArrowLeft className="w-4 h-4 text-muted" />
          <span className="text-sm text-muted">Back</span>
        </Link>
      </div>
      {children}
    </Container>
  );
}
