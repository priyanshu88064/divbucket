import styles from "./checkbox.module.css";

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
    <label className={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {name}
    </label>
  );
};
