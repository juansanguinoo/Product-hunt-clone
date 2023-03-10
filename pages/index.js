import React, { useEffect, useState } from 'react';
import Layout from '../components/layouts/Layout';
import ProductDetails from '../components/layouts/ProductDetails';
import useProducts from '../hooks/useProducts';

const Index = () => {
  const { products } = useProducts('created');

  return (
    <div>
      <Layout>
        <div className="product-list">
          <div className="container">
            <ul className="bg-white">
              {products.map((product) => (
                <ProductDetails key={product.id} product={product} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Index;
