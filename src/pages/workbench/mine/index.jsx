import React from 'react';
import top from './assets/123.jpg';
import top2 from './assets/345.jpg';
import w from './assets/w.jpg';
import q from './assets/q.jpg';


const Minne = () => {
    return (
        <div style={{ background: '#f5f5f5' }}>
            <img src={top} alt="" style={{ width: '100%' }} />
            <img src={w} alt="" style={{ width: '100%', padding: '20px' }} />
            <img src={q} alt="" style={{ width: '100%', padding: '20px' }} />
        </div>
    )
}
export default Minne