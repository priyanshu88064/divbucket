import { FaCaretDown } from 'react-icons/fa';
import styles from './select.module.css';

export default ({ options,values, onChange, value }) => {
    return (
        <div className={styles.select}>
            <input
                className={styles.si}
                value={value}
                readOnly={true}
            />
            <div className={styles.dropdown}>
                {
                    options?.map((option, ind) => (
                        <div
                            key={option + "" + ind}
                            onMouseDown={() => onChange(values[ind])}
                        >
                            {option}
                        </div>
                    ))
                }
            </div>
            <FaCaretDown className={styles.sicon} size={13} />
        </div>
    );
}