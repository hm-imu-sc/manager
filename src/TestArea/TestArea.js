import React, { useState } from "react";
import Comp from "./Comp/Comp";

const TestArea = () => {
    const [data, setData] = useState("100");

    return (
        <div>
            <h1>{data}</h1>
            <Comp data={data} onChange={data => setData(data)} />
        </div>
    );
}

export default TestArea;
