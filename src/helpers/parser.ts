const escapeChar = '\\';
const dotChar = '.';

function parseDotPath(path: string): string[] {
    if (path.length < 1) return [''];

    const result = [] as string[];
    let currentPart = '';

    const savePart = () => {
        result.push(currentPart);
        currentPart = '';
    };

    for (let i = 0; i < path.length; i++) {
        const current = path[i];
        const next = path[i + 1];

        switch (current) {
        case escapeChar:
            if (next === escapeChar || next === dotChar) {
                currentPart += next;
                i++;
            } else {
                currentPart += current;
            }
            break;
        case dotChar:
            savePart();
            break;
        default:
            currentPart += current;
            break;
        }

        if (!next) savePart();
    }

    return result;
}

export default parseDotPath;
