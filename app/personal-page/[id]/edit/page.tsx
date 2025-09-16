import EditPersonalPageForm from "@/components/forms/edit-personal-page-form";

type PersonalPageProps = { params: Promise<{ id: string }> };

export default async function EditPersonalPage({ params }: PersonalPageProps) {
  const userId = (await params).id;

  return (
    <div className="container-custom max-w-6xl">
      <EditPersonalPageForm id={userId} />
    </div>
  );
}
