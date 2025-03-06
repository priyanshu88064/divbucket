import styles from './checkbox.module.css';

export default ({ name, checked, onChange }) => {
    return (
        <label className={styles.checkbox}>
            <input
                type='checkbox'
                checked={checked}
                onChange={onChange}
            />
            {name}
        </label>
    );
}