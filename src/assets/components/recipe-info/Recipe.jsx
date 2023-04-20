import './Recipe.css'
import './PictureAndInfo.css'
import './NutritionTable.css'
import './Ingredient.css'
import './Instructions.css'
import {getRecipeById, getSimilarRecipes} from '../../../utils'
import { useEffect, useState } from 'react'
import {TfiTimer} from 'react-icons/tfi'
import {BiDish} from 'react-icons/bi'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const key = '338a43afc1f444c08393d10c361ea4e9';

export default function Recipe(){
   
    const [recipe, setRecipe] = useState(null);
    const [nutritions, setNutritions] = useState(null);
    const [similars, setSimilars] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [isMobile, setMobile] = useState(window.innerWidth<730);

    const updateMedia = () =>{
        setMobile(window.innerWidth<730)
    }

    useEffect(()=>{
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    }, [isMobile]);

    //Hämta information för recept
    useEffect(()=>{
        const fetchData = async () =>{
        let id = 615761;
        let response = await getRecipeById(id);
        console.log(response);
        setRecipe(response); 
    
    }
        fetchData();
    },[])

    //Hämta Näringsvärde för recept
    useEffect(()=>{
        const fetchData = async () =>{ 
        let id = 615761;
        let response = await fetch(`https://api.spoonacular.com/recipes/${id}/nutritionWidget.json`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': `${key}`
            }
        })
    
        const data = await response.json()
    
        setNutritions(data)
    
    }
        fetchData();
    },[])

    //Hämta linkande recept
    useEffect(()=>{
        const fetchData = async () =>{ 
        let id = 615761;
        let response = await getSimilarRecipes(id);
        console.log(response); 
        setSimilars(response);
    }
        fetchData();
    },[])


    function handleShowMore(){
        setShowMore(!showMore);
    }

    if((recipe != null) && (nutritions != null) && (similars != null)){
        
        return(
            <>  
                <h2>{recipe.title}</h2>
                <div className="recipe-container">
                
                    <div className="picture-pictureInfo-and-nutritionTable-container">
                        <div className="recipe-section-pictureAndInfo">
                            <PictureAndInfo image = {recipe.image} cookTime = {recipe.readyInMinutes} serving = {recipe.servings}/>
                        </div>
                        <div>
                        {isMobile? 
                         (<div className='showMorebtn' >
                        <button onClick={handleShowMore}>
                            {showMore? 'Hide': 'Show'} ingredients
                        </button>
                        {showMore && 
                        <div className="recipe-section-nutritionTable">
                            <NutritionTable nutritionValues = {nutritions['bad']} proteins = {nutritions[`protein`]} />
                        </div>}
                        </div>):
                        (<div className="recipe-section-nutritionTable">
                        <NutritionTable nutritionValues = {nutritions['bad']} proteins = {nutritions[`protein`]} />
                        </div>)} 
                        </div> 
                    </div>

                    <div className="recipe-section-ingredients">
                            <Ingredient ingredients = {recipe.extendedIngredients} />
                    </div>
    
                    <div className="recipe-section-insturcions">
                            <Instructions steps = {recipe.instructions} />
                    </div> 

                    <h2>Similar Recipes</h2>
                    <div className='similar-recipes'>
                        {similars.map(rec => <FejkKort id = {rec.id} image={recipe.image} title={rec.title} servings={rec.servings} readyInMinutes={rec.readyInMinutes}/>)} 
                    </div>                          
                </div>
            </> 
             
        )
    }
}

//Komponent som håller Bild, antal servings och tid att laga
const PictureAndInfo = (props) => {
    return(
        <article className='picture-and-info-container'>
            <img className="recipe-picture" src={props.image} alt="Image of recipe" />
            {/*Att styla sen med fontawsome*/}
            <div className='extra-recipe-info'>
                <div>
                    <b><TfiTimer /></b> {'   '}
                    <span><b>{props.cookTime}</b></span>
                    <span><b>min.</b></span>
                </div>
                <div>
                <b><BiDish /></b> {'   '}
                    <span><b>{props.serving}</b></span>
                    <span><b>people</b></span>
                </div>
            </div>
        </article>  
    )
}

//Komponent med tabell som håller näringsinnehållet.
const NutritionTable = (props) => {
    return(
        <aside className='nutrition-table-container'>
          <table className="nutrition-table">
              <tr>
                  <th>Nutritions</th>
                  <th>Amount</th>
              </tr>
              {props.nutritionValues.map(nutr => <tr>
                  <td>{nutr.title}</td>
                  <td>{nutr.amount}</td>
              </tr>)}                 
              <tr>
                  <td>Protein</td>
                  <td>{props.proteins}</td>
              </tr>
          </table>
        </aside>  )
}

//Komponent som håller ingredienser och mått
const Ingredient = (props) => {
    return(
        <div className="ingredients-container">
            <h2>Ingredients</h2>
            <ul className="list-ingredients">
                {/* list-row" för att kunna arrangera olika information av samma ingrediens med hjälp av flex */}
                {props.ingredients.map(ingredient => <li key={ingredient.id} className="list-row"> 
                    <div className='ingredient-name'><b>{ingredient.nameClean}</b></div>
                    <div className='amount-unit'><span>{ingredient.amount}</span>{' '} <span>{ingredient.unit}</span></div>
                </li> )}
            </ul>
        </div>
    )
}

//Komponent som håller i stegen
const Instructions = (props) => {
    return(
        <div className='instructions-container'>
            <h2>Steps</h2>
            <div className='instructions' dangerouslySetInnerHTML={{__html: props.steps}}></div>
        </div> 
    )
}

const FejkKort = ({id, image, title, servings, readyInMinutes}) => {
        return (
          <div className='card-container'>
          <Card key={id} style={{ width: '25rem' }} >
            <Card.Img variant="top" src={image}  className='card-image'/>
            <Card.Body>
              <Card.Title className='card-title'>{title}</Card.Title>
              <Card.Text className='card-text'>
               Servings: {servings}
               <br/>
               Ready in minutes: {readyInMinutes}
              </Card.Text>
              <Button variant="primary" className='card-button'>View Recipe</Button>
            </Card.Body>
          </Card>
          </div>
        );
}