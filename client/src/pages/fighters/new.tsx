import PageTitle from "@/components/PageTitle";
import WizardForm from "@/components/WizardForm";

const NewFighter = () => {
  return (
    <>
      <PageTitle title="Create a Fighter" />
      <p className="w-full mx-auto p-4 tablet:max-w-xl">
        Fighters you create are public. Only the newest 3 are kept, and they
        are cleared from time to time.
      </p>
      <WizardForm />
    </>
  );
};

export default NewFighter;
