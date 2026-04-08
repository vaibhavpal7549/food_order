import React from 'react'
//type rafce to create a functional component
//items nad price is props
const Fooditem = ({item, price}) => {
  return (
    <div style={ {border: "1px solid black", padding: "10px", margin: "10px", borderRadius:"10px", width: "200px"} }>
        <h2>{item}</h2>
        <h2>{price}</h2>
        <button style ={{backgroundColor:"green", cursor: "pointer"}}>Add to Cart</button>
    </div>
  )
}

export default Fooditem

