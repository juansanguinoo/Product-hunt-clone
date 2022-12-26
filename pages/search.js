import React, { useEffect, useState } from 'react';
import Layout from '../components/layouts/Layout';
import { useRouter } from 'next/router';
import ProductDetails from '../components/layouts/ProductDetails';
import useProducts from '../hooks/useProducts';

const Search = () => {
  const router = useRouter();
  const {
    query: { q },
  } = router;

  const { products } = useProducts('created');
  const [result, setResult] = useState([]);

  useEffect(() => {
    const searchQuery = q.toLowerCase();
    const filtered = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
      );
    });
    if (filtered.length === 0) return;
    setResult(filtered);
  }, [q, products]);

  return (
    <div>
      <Layout>
        <div className="product-list">
          <div className="container">
            <ul className="bg-white">
              {result.map((product) => (
                <ProductDetails key={product.id} product={product} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Search;
