import WizardForm from "@/components/wizardForm";
import { useFighter } from "@/hooks/useFighter";
import { useRouter } from "next/router";

const EditFighter = () => {
  const router = useRouter();
  const { data: fighter } = useFighter(router.query.id);

  if (!fighter) return <main>Loading...</main>;
  return <WizardForm fighter={fighter} />;
};

export default EditFighter;
