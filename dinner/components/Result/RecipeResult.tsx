// RecipeResult.tsx
import React from 'react';

interface RecipeDetails {
  title: string;
  ingredients: string[];
  instructions: string;
}

interface Props {
  details: RecipeDetails;
}

const RecipeResult: React.FC<Props> = ({ details }) => {
  return (
    <div className="recipe-details">
      <h2>{details.title}</h2>
      <div>
        <h3>Ingredients:</h3>
        <ul>
          {details.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Instructions:</h3>
        <p>{details.instructions}</p>
      </div>
    </div>
  );
};

export default RecipeResult;