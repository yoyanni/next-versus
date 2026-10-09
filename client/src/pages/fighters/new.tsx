import WizardForm from "@/components/WizardForm";

const NewFighter = () => {
  return (
    <>
      <p className="p-4">
        Fighters you create are public. Only the newest 3 are kept, and they
        are cleared from time to time.
      </p>
      <WizardForm />
    </>
  );
};

export default NewFighter;
