import * as React from 'react';
import * as styles from './style.scss';
import { Spin } from 'antd';
export default () => (
    <div className={styles.loading}>
        <Spin />
    </div>
);
