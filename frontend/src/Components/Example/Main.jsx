import React from 'react'
import Fooditem from './Fooditem';

const Main = () => {
  return (
    <div>
        <Fooditem item="Burger" price={350}/>
        <Fooditem item="Pizza" price={500}/>
        <Fooditem item="Pasta" price={400}/>

    </div>
  )
}

export default Main