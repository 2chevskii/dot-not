// function splitDottedPath(dottedPath: string): string[] {
//     const escapeChar = '\\';
//     const dotChar = '.';
//     const propParts = new Array<string>();
//     let currentPart = '';
//     const savePart = () => {
//         if (currentPart.length > 0 && ![...currentPart].every(char => char === ' ')) {
//             propParts.push(currentPart);
//             currentPart = '';
//         }
//     };
//     for (let i = 0; i < dottedPath.length; i++) {
//         const currentChar = dottedPath[i];
//         const nextChar = dottedPath[i + 1];
//         if (currentChar === escapeChar && (nextChar === escapeChar || nextChar === dotChar)) {
//             currentPart += nextChar;
//             i += 1;
//             continue;
//         }
//         if (!(currentChar === dotChar)) {
//             currentPart += currentChar;
//             if (i !== dottedPath.length - 1) {
//                 continue;
//             }
//         }
//         savePart();
//     }
//     for (let i = 0; i < propParts.length; i++) {
//         propParts[i] = propParts[i].replace('\\\\', '\\');
//     }
//     return propParts;
// }

// export default splitDottedPath;

// //////////////////// PARSER V2 /////////////////////////

const escapeChar = '\\';
const dotChar = '.';

function parseDotPath(path: string): string[] {
    const result = [] as string[];
    let currentPart = '';

    const savePart = () => {
        if (currentPart.length <= 0) return;

        result.push(currentPart);
        currentPart = '';
    };

    for (let i = 0; i < path.length; i++) {
        const currentChar = path[i];
        const nextChar = path[i + 1];

        if (currentChar === escapeChar && (nextChar === escapeChar || nextChar === dotChar)) {
            currentPart += nextChar;
            i++;
        } else if (currentChar === dotChar) savePart(); else currentPart += currentChar;
    }

    savePart();

    return result;
}

export default parseDotPath;
