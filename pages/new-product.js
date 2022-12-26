import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layouts/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';
import Error404 from '../components/layouts/404';
import { FirebaseContext } from '../firebase';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import useValidation from '../hooks/useValidation';
import validateCreateProduct from '../validation/validateCreateProduct';
import { v4 as uuidv4 } from 'uuid';
import { css } from '@emotion/react';

const INITIAL_STATE = {
  name: '',
  company: '',
  image: '',
  url: '',
  description: '',
};

const NewProduct = () => {
  const [error, setError] = useState(false);
  const [urlImage, setUrlImage] = useState(null);

  const { values, errors, handleSubmit, handleChange, handleBlur } =
    useValidation(INITIAL_STATE, validateCreateProduct, createProduct);

  const { name, company, url, description } = values;

  const router = useRouter();

  const { user } = useContext(FirebaseContext);

  async function createProduct() {
    if (!user) {
      return router.push('/login');
    }

    const product = {
      name,
      company,
      url,
      urlImage,
      description,
      votes: 0,
      comments: [],
      created: Date.now(),
      creator: {
        id: user.uid,
        name: user.displayName,
      },
      hasVoted: [],
    };

    const db = getFirestore();
    const productsCollection = collection(db, 'products');
    try {
      await addDoc(productsCollection, product);
      return router.push('/');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, uuidv4());
    try {
      await uploadBytes(storageRef, file);
      getDownloadURL(storageRef).then((url) => {
        setUrlImage(url);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Layout>
        {!user ? (
          <Error404 />
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}>
              New Product
            </h1>
            <Form onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>General Information</legend>
                <Field>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Product Name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.name && <Error>{errors.name}</Error>}

                <Field>
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    placeholder="Company´s Name"
                    name="company"
                    value={company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.company && <Error>{errors.company}</Error>}

                <Field>
                  <label htmlFor="image">Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleUploadImage}
                    onBlur={handleBlur}
                  />
                </Field>

                <Field>
                  <label htmlFor="url">URL</label>
                  <input
                    type="url"
                    id="url"
                    placeholder="URL of your product"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.url && <Error>{errors.url}</Error>}
              </fieldset>

              <fieldset>
                <legend>About your product</legend>

                <Field>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>

                {errors.description && <Error>{errors.description}</Error>}
              </fieldset>

              {error && <Error>{error}</Error>}

              <InputSubmit type="submit" value="New Product" />
            </Form>
          </>
        )}
      </Layout>
    </div>
  );
};

export default NewProduct;
