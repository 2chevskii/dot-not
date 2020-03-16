function splitDottedPath(dottedPath: string): string[] {
    const escapeChar = '\\';
    const dotChar = '.';
    const propParts = new Array<string>();
    let currentPart = '';
    const savePart = () => {
        if (currentPart.length > 0) {
            propParts.push(currentPart);
            currentPart = '';
        }
    };
    for (let i = 0; i < dottedPath.length; i++) {
        const currentChar = dottedPath[i];
        const nextChar = dottedPath[i + 1];
        if (currentChar === escapeChar && (nextChar === escapeChar || nextChar === dotChar)) {
            currentPart += nextChar;
            i += 1;
            continue;
        }
        if (!(currentChar === dotChar)) {
            currentPart += currentChar;
            if (i !== dottedPath.length - 1) {
                continue;
            }
        }
        savePart();
    }
    for (let i = 0; i < propParts.length; i++) {
        propParts[i] = propParts[i].replace('\\\\', '\\');
    }
    return propParts;
}

export default splitDottedPath;
