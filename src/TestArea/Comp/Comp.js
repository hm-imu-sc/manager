import React from "react";


const Comp = (props) => {
    return (
        <input type="text" value={props.data} onChange={event => props.onChange(event.target.value)} />
    )
}

export default Comp;