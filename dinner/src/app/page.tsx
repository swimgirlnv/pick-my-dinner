'use client';

import styles from "./page.module.css";
import { useEffect, useState } from 'react';
import { sql } from "@vercel/postgres";

import React, { createContext, useContext } from 'react';

// Step 1: Define the Restaurant interface
interface Restaurant {
  name: string;
  foodType: string;
  location: string;
  ranking: number;
  review: string;
}

// Step 2: Create the RestaurantContext
const RestaurantContext = createContext<{ 
  restaurants: Restaurant[], addRestaurant: (restaurant: Restaurant) => void }>({ restaurants: [], addRestaurant: () => {} });

// Step 3: Create the RestaurantProvider
const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const addRestaurant = (restaurant: Restaurant) => {
    setRestaurants([...restaurants, restaurant]);
  };

  return (
    <RestaurantContext.Provider value={{ restaurants, addRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
};

// Step 4: Create the RestaurantForm
const RestaurantForm: React.FC = () => {
  const [name, setName] = useState('');
  const [foodType, setFoodType] = useState('');
  const [location, setLocation] = useState('');
  const { addRestaurant } = useContext(RestaurantContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRestaurant({ name, foodType, location, ranking: 0, review: ''});
    setName('');
    setFoodType('');
    setLocation('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className={styles.input} />
      </label>
      <label>
        Food Type:
        <input type="text" value={foodType} onChange={e => setFoodType(e.target.value)} required className={styles.input} />
      </label>
      <label>
        Location:
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} required className={styles.input} />
      </label>
      <button type="submit" className={styles.button}>Add Restaurant</button>
    </form>
  );
};
// Step 5: Create the RestaurantFilter
const RestaurantFilter: React.FC = () => {
  const [foodTypeFilter, setFoodTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const { restaurants } = useContext(RestaurantContext);

  const filteredRestaurants = restaurants.filter(restaurant => 
    (foodTypeFilter === '' || restaurant.foodType === foodTypeFilter) &&
    (locationFilter === '' || restaurant.location === locationFilter)
  );

  // return (
  //   <div>
  //     <label>
  //       Filter by food type:
  //       <input type="text" value={foodTypeFilter} onChange={e => setFoodTypeFilter(e.target.value)} />
  //     </label>
  //     <label>
  //       Filter by location:
  //       <input type="text" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
  //     </label>
  //     <ul>
  //       {filteredRestaurants.map((restaurant, index) => 
  //         <li key={index}>{restaurant.name}</li>
  //       )}
  //     </ul>
  //   </div>
  // );
  return (
    <div className={styles.form}>
      <label>
        Filter by food type:
        <input type="text" value={foodTypeFilter} onChange={e => setFoodTypeFilter(e.target.value)} className={styles.input} />
      </label>
      <label>
        Filter by location:
        <input type="text" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className={styles.input} />
      </label>
    </div>
  );
};

// Step 6: Create the RestaurantPicker
const RestaurantPicker: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const { restaurants } = useContext(RestaurantContext);

  const handlePick = () => {
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    setSelectedRestaurant(restaurants[randomIndex]);
  };

  return (
    <div>
      <button onClick={handlePick} className={styles.button}>Pick a restaurant</button>
      {selectedRestaurant && <p>You should go to: {selectedRestaurant.name}</p>}
    </div>
  );
};

// Usage
export default function Home() {
  return (
       <RestaurantProvider>
        <div className={styles.container}>
          <RestaurantForm />
          <RestaurantFilter />
          <RestaurantPicker />
        </div>
      </RestaurantProvider>   
  );
}