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
    <label className="w-full flex gap-2 rounded-sm select-none">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {name}
    </label>
  );
};
