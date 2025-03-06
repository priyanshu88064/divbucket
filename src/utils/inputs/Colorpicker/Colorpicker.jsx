import { useEffect, useState } from 'react';
import Select from '../Select/Select';
import styles from './colorpicker.module.css';
import { useDebounce } from '../../hooks/useDebounce';

export default ({ value, onChange }) => {

    const [hex, setHex] = useState(value);
    const debounce = useDebounce(hex,500);

    useEffect(()=>{
        onChange(debounce);
    },[debounce]);

    return (
        <div className={styles.picker}>
            <input
                type='text'
                value={hex}
                onChange={e => {
                    setHex(e.target.value);
                }}
                className={styles.su}
                onFocus={e => e.target.select()}
                maxLength={7}
                size={2}
            />
            <input
                type='color'
                value={hex}
                className={styles.si}
                onChange={e => {
                    setHex(e.target.value)
                }}
            />
        </div>
    );
}