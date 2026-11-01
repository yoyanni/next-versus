import WizardForm from "@/components/WizardForm";
import { useFighter } from "@/hooks/useFighter";
import { SANDBOX_ID_START } from "@shared/limits";
import { useRouter } from "next/router";

const EditFighter = () => {
  const router = useRouter();
  const { data: fighter } = useFighter(router.query.id);

  if (!fighter) return <main>Loading...</main>;
  if (fighter._id < SANDBOX_ID_START)
    return (
      <main className="w-full mx-auto p-4 tablet:max-w-xl">
        Seed fighters are read-only. Create your own to try editing.
      </main>
    );
  return <WizardForm fighter={fighter} />;
};

export default EditFighter;
