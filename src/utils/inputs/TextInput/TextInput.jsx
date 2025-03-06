import styles from './textinput.module.css';
import { useEffect, useState } from 'react';

export default ({ auto, onChange, value, units }) => {

    const [val, setVal] = useState(value);

    useEffect(() => {
        setVal(value);
    }, [value]);

    return (
        <div className={styles.ti}>
            <input
                value={val===auto?"auto":val}
                className={val === "auto" || val===auto ? styles.auto : ''}
                onChange={e => setVal(e.target.value)}
                onBlur={() => onChange(val)}
                onFocus={e => e.target.select()}
                onKeyUp={e => {
                    if (e.key === "Enter")
                        onChange(val);
                }}
            />
            {
                units && units.length &&
                <div className={styles.dropdown}>
                    {
                        units.map(unit => (
                            <div onMouseDown={() => {
                                if (unit === "auto")
                                    setVal(auto);
                                else setVal(unit);
                            }} key={unit}>{unit}</div>
                        ))
                    }
                </div>
            }
        </div>
    );
}