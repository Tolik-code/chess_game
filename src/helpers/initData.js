export const defaulTableMatrix = () => {
    const arrTable = []
    const arrRow = []
    arrTable.length = 8;
    arrRow.length = 8;

    arrRow.fill({});
    arrRow.map(item => ({}));

    arrTable.fill(arrRow);
    arrTable.map(row => row.map(cell => ({...cell})));

    const getTableRowWithFigurePawn = (color) => {
        const arr = []
        arr.length = 8;
        arr.fill({type: 'pawn', color, symbolCode: color === 'white' ? <>&#9817;</> : <>&#9823;</>})
        arr.map(item => ({...item}));

        return arr;
    };

    const getTableRowWithFigure = (color) => {
        return [
            {color, type: 'rook', symbolCode: color === 'white' ? <>&#9814;</>: <>&#9820;</>},
            {color, type: 'knight', symbolCode: color === 'white' ? <>&#9816;</>: <>&#9822;</>},
            {color, type: 'bishop', symbolCode: color === 'white' ? <>&#9815;</>: <>&#9821;</>},
            {color, type: 'queen', symbolCode: color === 'white' ? <>&#9813;</>: <>&#9819;</>},
            {color, type: 'king', symbolCode: color === 'white' ? <>&#9812;</>: <>&#9818;</>},
            {color, type: 'bishop', symbolCode: color === 'white' ? <>&#9815;</>: <>&#9821;</>},
            {color, type: 'knight', symbolCode: color === 'white' ? <>&#9816;</>: <>&#9822;</>},
            {color, type: 'rook', symbolCode: color === 'white' ? <>&#9814;</>: <>&#9820;</>},
        ]
    };

    arrTable[1] = getTableRowWithFigurePawn('black')
    arrTable[6] = getTableRowWithFigurePawn('white')

    arrTable[0] = getTableRowWithFigure('black');
    arrTable[7] = getTableRowWithFigure('white');

    // arrTable.map(row => row.map(cell => ({...cell})));
    arrTable[2] = [{}, {}, {}, {}, {}, {}, {}, {}];
    arrTable[3] = [{}, {}, {}, {}, {}, {}, {}, {}];
    arrTable[4] = [{}, {}, {}, {}, {}, {}, {}, {}];
    arrTable[5] = [{}, {}, {}, {}, {}, {}, {}, {}];
    // console.log(arrTable)
    return arrTable;
}

export const getSymbolCodeFigure = (figure) => {
    switch(figure.type) {
        case 'rook':
            return {...figure, symbolCode: figure.color === 'white' ? <>&#9814;</>: <>&#9820;</>}
        case 'knight':
            return {...figure, symbolCode: figure.color === 'white' ? <>&#9816;</>: <>&#9822;</>}
        case 'bishop':
            return {...figure, symbolCode: figure.color === 'white' ? <>&#9815;</>: <>&#9821;</>}
        case 'queen':
            return {...figure, symbolCode: figure.color === 'white' ? <>&#9813;</>: <>&#9819;</>}
        case 'king':
            return {...figure, symbolCode: figure.color === 'white' ? <>&#9812;</>: <>&#9818;</>}
        case 'pawn':
            return {...figure, symbolCode: figure.color === 'white' ? <>&#9817;</> : <>&#9823;</>}
        default: return figure;
    }
}