import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import ChildAccordion from "@/components/ChildAccordion";
import ConfirmDialog from "@/components/ConfirmDialog";
import LinkButton from "@/components/LinkButton";
import Loading from "@/components/Loading";
import MoveAccordion from "@/components/MoveAccordion";
import { useFighter } from "@/hooks/useFighter";
import { apiClient } from "@/service/apiClient";
import standard from "@/standard";
import { SANDBOX_ID_START } from "@shared/limits";
import { ActiveAccordion } from "@/types/component";
import { formatRank } from "@/utils/formatRank";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Fighter() {
  const router = useRouter();
  const { data: fighter } = useFighter(router.query.id);
  const queryClient = useQueryClient();
  const [activeAccordion, setActiveAccordion] =
    useState<ActiveAccordion | null>(null);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    try {
      await apiClient.delete(`/fighters/${fighter?._id}`);
      queryClient.invalidateQueries({ queryKey: ["fighters"] });
      router.push("/fighters");
    } catch (error) {
      console.error("Failed to delete fighter:", error);
    } finally {
      setOpen(false);
    }
  }

  if (!fighter) return <Loading label="Loading fighter…" />;

  function handleToggle(accordion: "moves" | "stats") {
    if (activeAccordion === accordion) setActiveAccordion(null);
    else setActiveAccordion(accordion);
  }

  return (
    <main className="w-full mx-auto tablet:max-w-3xl desktop:max-w-6xl desktop:grid desktop:grid-cols-3 desktop:gap-8 desktop:items-start">
      <div className="p-4 desktop:sticky desktop:top-20">
        <h1 className="text-primaryFontSize font-bold">
          {fighter.firstName}{" "}
          {fighter.nickname && <>&apos;{fighter.nickname}&apos; </>}
          {fighter.lastName}
        </h1>
        <div className="tablet:grid tablet:grid-cols-2 tablet:gap-x-8 desktop:grid-cols-1">
          <div>
            <span className="font-semibold">Rank:</span>{" "}
            <span>{formatRank(fighter.rank)}</span>
          </div>
          <div>
            <span className="font-bold">Weight Class: </span>
            <span>{fighter.weightClass}</span>
          </div>
          <div>
            <span className="font-bold">Martial Arts: </span>
            <span>{fighter.basic.skills.martialArt}</span>
          </div>
          <div>
            <span className="font-bold">Stance: </span>
            <span>{fighter.basic.skills.stance}</span>
          </div>
          <div>
            <span className="font-bold">Reach: </span>
            <span>{fighter.basic.skills.reach}</span>
          </div>
          <div>
            <span className="font-bold">Level: </span>
            <span>{fighter.basic.level}</span>
          </div>
        </div>
      </div>
      <div className="desktop:col-span-2 desktop:mt-4">
        <div className="tablet:mx-4 tablet:border tablet:rounded-lg tablet:overflow-hidden">
          <Accordion
            noShadow
            title="Stats"
            activeAccordion={activeAccordion}
            handleToggle={() => handleToggle("stats")}
          >
            {standard.statKeys.map((statGroup) => (
              <ChildAccordion key={statGroup.key} title={statGroup.title}>
                {Object.entries(fighter[statGroup.key].skills).map(
                  ([skill, level]) => {
                    const skillName =
                      standard[statGroup.key].find(
                        (standard) => standard.propName === skill
                      )?.name ?? "Not found";
                    return (
                      <div
                        key={skillName}
                        className="flex justify-between ps-8 pe-4 odd:bg-mainBgElevated"
                      >
                        <span>{skillName}</span>
                        <span>{level}</span>
                      </div>
                    );
                  }
                )}
              </ChildAccordion>
            ))}
          </Accordion>
          <Accordion
            noShadow
            title="Moves"
            activeAccordion={activeAccordion}
            handleToggle={() => handleToggle("moves")}
          >
            <MoveAccordion moves={fighter.moves} nested />
          </Accordion>
        </div>
        {fighter._id >= SANDBOX_ID_START ? (
          <div className="flex justify-center gap-4 mt-4">
            <LinkButton
              href={`/fighters/${fighter._id}/edit`}
              title="Edit Fighter"
            />
            <Button title="Delete Fighter" onClick={() => setOpen(true)} />
          </div>
        ) : (
          <p className="text-center mt-4">
            Seed fighters are read-only. Create your own to try editing.
          </p>
        )}
      </div>
      <ConfirmDialog
        open={open}
        title="Delete Fighter"
        message="Are you sure you want to delete this fighter?"
        onCancel={() => setOpen(false)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
