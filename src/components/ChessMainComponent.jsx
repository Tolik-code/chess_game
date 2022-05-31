import React, {useState} from 'react';
import {ChessTableWrapp} from './ChessTableWrapp'
import './../projects/styles/chessMainStyles.scss';

export const ChessMainComponent = ({}) => {
  return (
    <div className='chessMainComponent'>
      <ChessTableWrapp />
    </div>
  )
}