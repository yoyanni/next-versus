import Loading from "@/components/Loading";
import PageTitle from "@/components/PageTitle";
import WizardForm from "@/components/WizardForm";
import { useFighter } from "@/hooks/useFighter";
import { SANDBOX_ID_START } from "@shared/limits";
import { useRouter } from "next/router";

const EditFighter = () => {
  const router = useRouter();
  const { data: fighter } = useFighter(router.query.id);

  const pageTitle = (
    <PageTitle
      title={
        fighter ? `Edit ${fighter.firstName} ${fighter.lastName}` : "Edit Fighter"
      }
    />
  );

  if (!fighter)
    return (
      <>
        {pageTitle}
        <Loading label="Loading fighter…" />
      </>
    );
  if (fighter._id < SANDBOX_ID_START)
    return (
      <main className="w-full mx-auto p-4 tablet:max-w-xl">
        {pageTitle}
        Seed fighters are read-only. Create your own to try editing.
      </main>
    );
  return (
    <>
      {pageTitle}
      <WizardForm fighter={fighter} />
    </>
  );
};

export default EditFighter;
