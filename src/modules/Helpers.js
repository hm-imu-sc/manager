
export const isNullOrEmpty = x => {
    return x === undefined || x === null || x === "";
}

export const updateProps = (oldProps, newProps) => {
    // const mergedProps = copy(oldProps);
    const mergedProps = {...oldProps};
    for (let prop of Object.keys(newProps)) {
        mergedProps[prop] = newProps[prop];
    }
    return mergedProps;
}

export const updateState = (oldProps, newProps, setStateFunction) => {
    const newState = updateProps(oldProps, newProps);
    setStateFunction(newState);
}

export const setDefaultProps = (props, defaultProps) => {
    // const updatedProps = copy(props);
    const updatedProps = {...props};
    const defaultKeys = Object.keys(defaultProps);

    for (const key of defaultKeys) {
        if (Object.keys(updatedProps).find(k => k === key) === undefined) {
            updatedProps[key] = defaultProps[key];
        }
    }

    return updatedProps;
}

export const copy = object => JSON.parse(JSON.stringify(object));

export const copyPrimitive2D = ar => ar.map(r => [...r]);