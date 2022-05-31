import React, {useEffect, useState, useCallback} from 'react';
import {defaulTableMatrix, getSymbolCodeFigure} from './../helpers/initData';
import {ChessCellComponent} from './ChessCellComponent';
import './../projects/styles/chessMainStyles.scss';

export const ChessTableWrapp = ({}) => {
  const [tableMatrix, setTableMatrix] = useState(defaulTableMatrix());
  const [activeFigure, setActiveFigure] = useState(null);
  const [winningFigures, setWinningFigures] = useState({white: [], black: []});
  const [activeColorCanMove, setActiveColorCanMove] = useState('white')
  const [showWinsModal, setShowWinsModal] = useState(false)
  const [showLoadList, setShowLoadList] = useState(false)
  const [loadList, setLoadList] = useState(false)
  const [currentGameId, setCurrentGameId] = useState(Date.now())
  // console.log(winningFigures, 'winningFigures');
  const moveFigure = (from, to) => {
    setActiveColorCanMove(currentColor => currentColor === 'white' ? 'black' : 'white');

    const loseFigure = {...tableMatrix[to.y][to.x]};
    if (loseFigure.type === 'king') {
      setShowWinsModal(loseFigure.color === 'white' ? 'black':'white')
    }
    if (tableMatrix[to.y][to.x].symbolCode) {
      setWinningFigures(prevList => ({...prevList, [loseFigure.color]: [...prevList[loseFigure.color], loseFigure]}));
    }

    setTableMatrix(currentTable => {
      // console.log(winningFigures, 'winningFigures');

      currentTable[to.y][to.x] = {...currentTable[from.y][from.x]}
      currentTable[from.y][from.x] = {}

      setActiveFigure(null);
      return [...currentTable];

    })
  }

  const getShowPossibleMovements = (typeFigure, coordinates) => {
    const activeFigureObj = tableMatrix[coordinates.y][coordinates.x];
    const copyTable = tableMatrix.map(row => row.map(cell => ({...cell})))

    const cycleTable = () => {
      for(let y = 0; y < 8; y++) {
        for(let x = 0; x < 8; x++) {

          switchMoveFigure(y, x)

        }
      }
    }
    const switchMoveFigure = (y, x) => {
      switch(typeFigure) {
        case 'rook': 
          return (function() {
            validateCanMoveHorizontal(coordinates, {y, x})
            validateCanMoveVertical(coordinates, {y, x})
            setTableMatrix(copyTable);
          }());
        case 'pawn': 
          return (function() {
            validateCanMovePawn(coordinates, {y, x}, (coordinates.y === 1 || coordinates.y === 6))
            setTableMatrix(copyTable);
          }());
        case 'queen': 
          return (function() {
            validateCanMoveHorizontal(coordinates, {y, x})
            validateCanMoveVertical(coordinates, {y, x})
            validateCanMoveDiagonal(coordinates, {y, x})
            setTableMatrix(copyTable);
          }());
        case 'bishop': 
          return (function() {
            validateCanMoveDiagonal(coordinates, {y, x})
            setTableMatrix(copyTable);
          }());
        case 'knight': 
          return (function() {
            validateCanMoveKnight(coordinates, {y, x})
            setTableMatrix(copyTable);
          }());
        case 'king': 
          return (function() {

            if (Math.max(coordinates.y, y) > Math.min(coordinates.y, y) + 1
              || Math.max(coordinates.x, x) > Math.min(coordinates.x, x) + 1) {
              return false;
            }

            validateCanMoveHorizontal(coordinates, {y, x})
            validateCanMoveVertical(coordinates, {y, x})
            validateCanMoveDiagonal(coordinates, {y, x})
            setTableMatrix(copyTable);
          }());
        default:
          return null
      }
    }

    const validateCanMovePawn = (from, to, firstMove) => {
      const currentColorFigure = copyTable[from.y][from.x].color
      const directionNumber = currentColorFigure === 'white' ? firstMove ? -2:-1 : firstMove ? 2:1

      if (copyTable[from.y][from.x].color === copyTable[to.y][to.x].color) {
        return false
      }

      if (from.y + (currentColorFigure === 'white' ? -1:1) === to.y && Math.abs(from.x - to.x) === 1 && copyTable[to.y][to.x].symbolCode) {
        copyTable[to.y][to.x].status = 'target_to_move';
        return true
      }

      if (copyTable[from.y + (currentColorFigure === 'white' ? -1:1)][from.x].symbolCode) {
        return false
      }

      if (!(directionNumber < 0 ? from.y > to.y : from.y < to.y)) {
        return false;
      }

      if (!((from.y + directionNumber === to.y
        || (firstMove && (directionNumber > 0 ? (from.y + directionNumber >= to.y) : (from.y + directionNumber <= to.y))))
        && from.x === to.x)
      ) {
        return false
      }

      if (copyTable[to.y][to.x].symbolCode) {
        return false;
      }

      copyTable[to.y][to.x].status = 'target_to_move';
      return true
    };

    const validateCanMoveKnight = (from, to) => {
      const absX = Math.abs(to.x - from.x)
      const absY = Math.abs(to.y - from.y)

      if (!(absX === 1 ? absY === 2 : absY === 1 ? absX === 2 : false) || copyTable[from.y][from.x].color === copyTable[to.y][to.x].color) {
        return false
      }

      copyTable[to.y][to.x].status = 'target_to_move';
      return true
    };

    const validateCanMoveDiagonal = (from, to) => {
      const absX = Math.abs(to.x - from.x)
      const absY = Math.abs(to.y - from.y)

      if (absX !== absY || copyTable[from.y][from.x].color === copyTable[to.y][to.x].color) {
        return false
      }

      const dx = from.x < to.x ? 1 : -1
      const dy = from.y < to.y ? 1 : -1

      for (let c = 1; c < absX; c++) {
        if (copyTable[from.y + dy * c][from.x + dx * c].symbolCode) {
          return false;
        }
      }

      copyTable[to.y][to.x].status = 'target_to_move';
      return true
    };

    const validateCanMoveHorizontal = (from, to) => {
      if (from.x !== to.x || copyTable[from.y][from.x].color === copyTable[to.y][to.x].color) {
        return false
      }

      const startY = Math.min(from.y, to.y)
      const endtY = Math.max(from.y, to.y)

      for (let y = startY + 1; y < endtY; y++) {
        if (copyTable[y][from.x].symbolCode) {
          return false;
        }
      }

      copyTable[to.y][to.x].status = 'target_to_move';
      return true
    };

    const validateCanMoveVertical = (from, to) => {
      if (from.y !== to.y || copyTable[from.y][from.x].color === copyTable[to.y][to.x].color) {
        return false
      }

      const startX = Math.min(from.x, to.x)
      const endtX = Math.max(from.x, to.x)

      for (let x = startX + 1; x < endtX; x++) {
        if (copyTable[from.y][x].symbolCode) {
          return false;
        }
      }

      copyTable[to.y][to.x].status = 'target_to_move';
      return true
    };

    cycleTable()
  }

  const clearStatusesCells = () => {
    setTableMatrix(currentTable => (
      currentTable.map(row => row.map(cell => ({...cell, status: null})))
    ))
  };

  const saveCurrentGame = () => {
    const saveGameList = localStorage.getItem('save_game');
    const saveGameListJSON = saveGameList ? JSON.parse(saveGameList):[];

    const tableMatrixNoSymbols = tableMatrix.map(row => row.map(cell => ({...cell, symbolCode: '',})))
    const winningFiguresNoSymbols = {
      white: winningFigures.white.map(item => ({...item, symbolCode: ''})),
      black: winningFigures.black.map(item => ({...item, symbolCode: ''})),
    }

    const saveObjCurrentGame = {
      id: currentGameId,
      tableMatrix: tableMatrixNoSymbols,
      name: `${new Date().toLocaleString()}`,
      activeColorCanMove,
      winningFigures: winningFiguresNoSymbols
    }

    const finishListSave = saveGameListJSON.find(save => save.id === currentGameId)
      ? saveGameListJSON.map(save => save.id === currentGameId ? saveObjCurrentGame : save)
      : saveGameListJSON.length >= 5
        ? (function() {saveGameListJSON[4] = saveObjCurrentGame; return saveGameListJSON}())
        : [...saveGameListJSON, saveObjCurrentGame];

    const saveGameJSON = JSON.stringify(finishListSave);
    // const saveGameJSON = JSON.stringify([{id: currentGameId, tableMatrix: tableMatrixNoSymbols, name: `${Date.now()}`}]);
    localStorage.setItem('save_game', saveGameJSON)
  };

  const loadSaveList = () => {
    const saveGameList = localStorage.getItem('save_game');
    const saveGameListJSON = saveGameList ? JSON.parse(saveGameList):[];

    setShowLoadList(true)
    setLoadList(saveGameListJSON)
  };

  const loadGame = (save) => {
    const winningsFiguresWithSymbols = {
      white: save.winningFigures.white.map(figure => getSymbolCodeFigure(figure)),
      black: save.winningFigures.black.map(figure => getSymbolCodeFigure(figure)),
    };
    const tableMatrixWithSymbols = save.tableMatrix.map(row => row.map(cell => getSymbolCodeFigure(cell)));

    setActiveColorCanMove(save.activeColorCanMove);
    setTableMatrix(tableMatrixWithSymbols);
    setWinningFigures(winningsFiguresWithSymbols);

    setShowLoadList(null)
  }
  const removeLoadItem = (removeSaveId, e) => {
    e.stopPropagation()

    const saveGameList = localStorage.getItem('save_game');
    const saveGameListJSON = saveGameList ? JSON.parse(saveGameList):[];

    const filteredSaveList =  saveGameListJSON.filter(item => item.id !== removeSaveId)

    const saveGameJSON = JSON.stringify(filteredSaveList);
    // const saveGameJSON = JSON.stringify([{id: currentGameId, tableMatrix: tableMatrixNoSymbols, name: `${Date.now()}`}]);
    localStorage.setItem('save_game', saveGameJSON)
    setLoadList(filteredSaveList)
  }

  const resetChessTable = useCallback(() => {
    setShowWinsModal(null);
    setWinningFigures({white: [], black: []});
    setActiveColorCanMove('white');
    setCurrentGameId(Date.now() - 1)

    setTableMatrix(defaulTableMatrix())
  }, [setTableMatrix])

  useEffect(() => {
    if (activeFigure) {
      getShowPossibleMovements(tableMatrix[activeFigure.y][activeFigure.x].type, activeFigure)
    }
  }, [activeFigure])

  return (
    <div className='chessPageWrapp'>

      <div className='chessControlBlock'>
          <div className='activeColorMoveBlock'>
            <p>Хід гравця</p>
            <div className={`activeColorMoveElement activeColorMoveElement_${activeColorCanMove}`}/>
          </div>

        <button className='resetGameControlBlockBtn' onClick={resetChessTable}>
          Запустити гру спочатку
        </button>
        <button className='resetGameControlBlockBtn' onClick={saveCurrentGame}>
          Зберегти гру
        </button>
        <button className='resetGameControlBlockBtn redBtn' onClick={loadSaveList}>
          Завантажити збережену гру
        </button>
      </div>

      <div>
        <div className={`winningsFiguresList winningsFiguresListWhite ${!winningFigures.white.length && 'hideList'}`}>
          {winningFigures.white.map((figure, idx) => <span key={`winnerFiguresWhite${idx}`}>{figure.symbolCode}</span>)}
        </div>

          <div className='tableWrapper'>
            {tableMatrix && tableMatrix.length && tableMatrix.map((tableRow, rowIdx) => (
              tableRow.map((tableCell, cellIdx) => (
                <ChessCellComponent
                  tableCell={tableCell}
                  coordinates={{y: rowIdx, x: cellIdx}}
                  activeFigure={activeFigure}
                  setActiveFigure={setActiveFigure}
                  moveFigure={moveFigure}
                  clearStatusesCells={clearStatusesCells}
                  key={`${rowIdx}_${cellIdx}`}
                  activeColorCanMove={activeColorCanMove}
                  cellColor={
                    rowIdx % 2 === 0
                      ? cellIdx % 2 === 0
                        ? 'white'
                        : 'black'
                      : cellIdx % 2 === 0
                        ? 'black'
                        : 'white'
                  }
                />
              ))
            ))}
          </div>
        <div className={`winningsFiguresList winningsFiguresListBlack ${!winningFigures.black.length && 'hideList'}`}>
          {winningFigures.black.map((figure, idx) => <span key={`winnerFiguresBlack${idx}`}>{figure.symbolCode}</span>)}
        </div>
      </div>

      {showWinsModal && (
        <div className='modalWrapp'>
          <div className='congratulateModal' onClick={(e) => e.stopPropagation()}>
            <p>Вітаємо !!! 🎉🎉🎉, перемогли {showWinsModal === 'white' ? 'білі' : 'чорні'}</p>

            <button className='resetGameControlBlockBtn' onClick={resetChessTable}>
              Запустити гру спочатку
            </button>

          </div>
        </div>
      )}
      {showLoadList && (
        <div className='modalWrapp' onClick={() => setShowLoadList(null)}>
          <div className='congratulateModal' onClick={(e) => e.stopPropagation()}>
            {loadList.length
              ? (
                <div className='loadModalListWrapp'>
                  {
                    loadList.map(load => (
                      <div className='loadModalListItem' onClick={() => loadGame(load)}>
                        <p>{load.name}</p>
                        <div className='activeColorMoveBlock activeColorMoveBlockModal'>
                          <p>Хід гравця</p>
                          <div className={`activeColorMoveElement activeColorMoveElement_${load.activeColorCanMove}`}/>
                        </div>

                        <div className='deleteBtn modalLoadItemBtn' onClick={(e) => removeLoadItem(load.id, e)}>
                          &#10006;
                        </div>
                      </div>
                    ))
                  }
                </div>
              ):(
                <p>Поки в вас немає збережень</p>
              )}

              <div className='closeModalBtn' onClick={() => setShowLoadList(null)}>&#10006;</div>
          </div>
        </div>
      )}
    </div>
  )
}