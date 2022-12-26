import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { FirebaseContext } from '../../firebase';

import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

import Error404 from '../../components/layouts/404';
import Layout from '../../components/layouts/Layout';

import { Field, InputSubmit } from '../../components/ui/Form';
import Button from '../../components/ui/Button';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const ProductContainer = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreatorProduct = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Product = () => {
  const [product, setProduct] = useState({});
  const [error, setError] = useState(false);
  const [comment, setComment] = useState({});
  const [queryDB, setQueryDB] = useState(true);

  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { user } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && queryDB) {
      const getProduct = async () => {
        const db = getFirestore();
        const productQuery = doc(db, 'products', id);
        const product = await getDoc(productQuery);
        if (product.exists()) {
          setProduct(product.data());
          setQueryDB(false);
        } else {
          setError(true);
          setQueryDB(false);
        }
      };
      getProduct();
    }
  }, [id]);

  if (Object.keys(product).length === 0 && !error) return 'Loading...';

  const {
    comments,
    company,
    created,
    description,
    name,
    url,
    urlImage,
    votes,
    creator,
    hasVoted,
  } = product;

  const voteProduct = () => {
    if (!user) {
      return router.push('/login');
    }
    const newTotal = votes + 1;
    if (hasVoted.includes(user.uid)) return;
    const newHasVoted = [...hasVoted, user.uid];

    const db = getFirestore();
    const productRef = doc(db, 'products', id);
    updateDoc(productRef, { votes: newTotal, hasVoted: newHasVoted });

    setProduct({
      ...product,
      votes: newTotal,
    });

    setQueryDB(true);
  };

  const commentChange = (e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value,
    });
  };

  const isCreator = (id) => {
    if (creator.id === id) {
      return true;
    }
  };

  const addComment = (e) => {
    e.preventDefault();

    if (!user) {
      return router.push('/login');
    }

    comment.userId = user.uid;
    comment.userName = user.displayName;

    const newComments = [...comments, comment];

    const db = getFirestore();
    const productRef = doc(db, 'products', id);
    updateDoc(productRef, { comments: newComments });

    setProduct({
      ...product,
      comments: newComments,
    });

    setQueryDB(true);
  };

  const canDelete = () => {
    if (!user) return false;

    if (creator.id === user.uid) {
      return true;
    }
  };

  const deleteProduct = async () => {
    if (!user) {
      return router.push('/login');
    }

    if (creator.id !== user.uid) {
      return router.push('/');
    }

    try {
      const db = getFirestore();
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className="container">
            <h1
              css={css`
                text-align: center;
                margin-top: 1rem;
              `}>
              {name}
            </h1>

            <ProductContainer>
              <div>
                <p>Posted {formatDistanceToNow(new Date(created))} ago</p>
                <p>
                  Published by {creator.name} from {company}
                </p>
                <img src={urlImage} />
                <p>{description}</p>

                {user && (
                  <>
                    <h2>Add a comment</h2>
                    <form onSubmit={addComment}>
                      <Field>
                        <input
                          type="text"
                          name="message"
                          onChange={commentChange}
                        />
                      </Field>
                      <InputSubmit type="submit" value="Add comment" />
                    </form>
                  </>
                )}

                <h2
                  css={css`
                    margin: 2rem 0;
                  `}>
                  Comments
                </h2>

                {comments.length === 0 ? (
                  'There are no comments'
                ) : (
                  <ul>
                    {comments.map((comment, i) => (
                      <li
                        key={`${comment.userId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}>
                        <p>{comment.message}</p>
                        <p>
                          Written by:
                          <span
                            css={css`
                              font-weight: bold;
                            `}>
                            {' '}
                            {comment.userName}
                          </span>
                        </p>
                        {isCreator(comment.userId) && (
                          <CreatorProduct>He´s the creator</CreatorProduct>
                        )}
                        {user && user.uid === comment.userId && (
                          <Button>Delete</Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <aside>
                <Button target="_blank" bgColor="true" href={url}>
                  Visit URL
                </Button>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}>
                  <p
                    css={css`
                      text-align: center;
                    `}>
                    {' '}
                    {votes} Votes
                  </p>
                  {user && <Button onClick={voteProduct}>Votes</Button>}
                </div>
              </aside>
            </ProductContainer>
            {canDelete() && (
              <Button onClick={deleteProduct}>Delete Product</Button>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Product;
