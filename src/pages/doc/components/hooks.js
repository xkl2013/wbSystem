import React, { useState, useEffect } from 'react';
console.log(React.ReactUpdates)


// export default class Hooks extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             count: 1,
//         }
//     }
//     onClick = () => {
//         for (let i = 0; i < 5; i += 1) {
//             this.setState({
//                 count: this.state.count + 1
//             })
//             // this.setState((pre, props) => {
//             //     return {
//             //         count: pre.count + 1,
//             //     }
//             // })
//         }
//     }

//     render() {
//         console.log(this.state.count)
//         return (
//             <div onClick={this.onClick}>{this.state.count}</div>
//         )
//     }
// }
export default function Hooks() {
    const [count, setCount] = useState(3);
    const [name, setName] = useState('sssss');
    useEffect(() => {
        document.title = `haha${name}`
    })
    return (
        <div onClick={() => { setCount(count + 1); setName(name + 'de') }}>
            <div>{name}</div>
            {count}</div>
    )
}