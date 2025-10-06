import React, { createContext, useState, useEffect, useContext } from 'react';
import carsData from '../data/cars.json';

const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [brandFilter, setBrandFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [colourFilter, setColourFilter] = useState('');

  useEffect(() => {
    setCars(carsData.cars);
    setFilteredCars(carsData.cars);
  }, []);

  useEffect(() => {
    const filtered = cars.filter(car => {
      const brandMatch = car.brand.toLowerCase().includes(brandFilter.toLowerCase());
      const modelMatch = car.model.toLowerCase().includes(modelFilter.toLowerCase());
      const colourMatch = car.colour.toLowerCase().includes(colourFilter.toLowerCase());
      return brandMatch && modelMatch && colourMatch;
    });
    setFilteredCars(filtered);
  }, [brandFilter, modelFilter, colourFilter, cars]);

  const clearFilters = () => {
    setBrandFilter('');
    setModelFilter('');
    setColourFilter('');
  };

  const uniqueBrands = [...new Set(cars.map(car => car.brand))];
  const uniqueModels = [...new Set(cars.map(car => car.model))];
  const uniqueColours = [...new Set(cars.map(car => car.colour))];

  const value = {
    cars,
    filteredCars,
    brandFilter,
    setBrandFilter,
    modelFilter,
    setModelFilter,
    colourFilter,
    setColourFilter,
    clearFilters,
    uniqueBrands,
    uniqueModels,
    uniqueColours
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};

export const useCars = () => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
};

export default CarContext;
