import React, {useState} from 'react';
import {svgSprite} from '../projects/svgSpriteCore';
import './../projects/styles/chessMainStyles.scss';

export const ChessCellComponent = ({ activeColorCanMove, key, tableCell, cellColor, coordinates, activeFigure, setActiveFigure, moveFigure, clearStatusesCells }) => {
  // const attackFigure = () => {};
  const isActive = activeFigure?.x === coordinates?.x && activeFigure?.y === coordinates?.y;

  const cellClickFunc = () => {

    if (tableCell.status === 'target_to_move') {
      clearStatusesCells()

      return moveFigure(activeFigure, coordinates)
    }

    if (tableCell.symbolCode) {
      clearStatusesCells()

      return (isActive || activeColorCanMove !== tableCell.color)
        ? setActiveFigure(null)
        : activeColorCanMove === tableCell.color && setActiveFigure(coordinates)
    }

    clearStatusesCells()
    return setActiveFigure(null);
  }

  return (
    <div
      key={key}
      tabIndex="-1"
      // onBlur={() => isActive ? (setActiveFigure(null) && clearStatusesCells()):''}
      className={`
          tableCell tableCell_${cellColor} 
          figureColor_${tableCell.color} 
          ${(tableCell.status === 'target_to_move' && tableCell.symbolCode) ? 'status_target_attack ':''}
          ${isActive ? 'activeCell': ''}
      `}
      onClick={cellClickFunc}
    >
      {tableCell.status === 'target_to_move' && !tableCell.symbolCode && <div  className='targetToMoveCellCircle'/>}
      {/* {tableCell.type && svgSprite(`figureIcon_${tableCell.type}`, { width: '22px', height: '22px' })} */}
      {tableCell.symbolCode}
    </div>
  )
}