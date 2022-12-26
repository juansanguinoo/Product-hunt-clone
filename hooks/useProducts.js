import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, orderBy } from 'firebase/firestore';

const useProducts = (order) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const db = getFirestore();
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const products = productsSnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setProducts(products);
    };
    getProducts();
  }, []);

  return {
    products,
  };
};

export default useProducts;
