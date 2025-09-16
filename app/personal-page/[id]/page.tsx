import { PersonalPageDisplay } from "@/components/display-things/display-personal-page";

type PersonalPageProps = { params: Promise<{ id: string }> };

export default async function PersonalPage({ params }: PersonalPageProps) {
  const userId = (await params).id;

  return (
    <div className="container-custom max-w-6xl">
      <PersonalPageDisplay givenUserId={userId} />
    </div>
  );
}
