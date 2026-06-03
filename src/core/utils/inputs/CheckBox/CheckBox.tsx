export default ({
  name,
  checked,
  onChange,
}: {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label className="flex w-fit items-center gap-2 rounded-sm px-1 py-0.5 text-[12px] text-[var(--wb_text_muted)] select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 cursor-pointer accent-[var(--wb_border_highlight)]"
      />
      <span className="leading-none">{name}</span>
    </label>
  );
};
