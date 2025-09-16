import { PersonalPageDisplay } from "@/components/display-things/display-personal-page";

interface PersonalPageProps {
  params: Promise<{ 
    id: string 
  }>;
}

export default async function PersonalPage({ params }: PersonalPageProps) {
  const userId = (await params).id;
  
  return (
    <div className="container-custom max-w-6xl">
      <PersonalPageDisplay userId={userId} />
    </div>
  );
}