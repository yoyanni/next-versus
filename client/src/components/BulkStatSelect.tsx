import { stats } from "@/config/formConfig";

interface BulkStatSelectProps {
  onSelect: (stat: number) => void;
}

// Always shows its placeholder, so the same value can be applied again after
// a stat is changed by hand
const BulkStatSelect = ({ onSelect }: BulkStatSelectProps) => (
  <div className="pb-2 mb-1 border-b">
    <div className="flex justify-between">
      <label htmlFor="bulkStat">Set all stats:</label>
      <select
        id="bulkStat"
        value=""
        onChange={(event) => onSelect(Number(event.target.value))}
      >
        <option value="">-- Select a value --</option>
        {stats.map((stat) => (
          <option key={stat} value={stat}>
            {stat}
          </option>
        ))}
      </select>
    </div>
    <p className="text-tertiaryFontSize text-secondaryDarkFontColor">
      Sets every stat below and estimates the level from it.
    </p>
  </div>
);

export default BulkStatSelect;
