import Groceries from "./assets/groceries.webp"

function Card(){
    return(
        <div className={"card"}>
            <img src={Groceries} alt="img" className={"card-image"}/>
            <h2>Kurt Suttin</h2>
            <p>Built in React Javascript</p>
        </div>
    )
}

export default Card;