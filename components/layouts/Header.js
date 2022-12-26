import React, { useContext } from 'react';
import Search from '../ui/Search';
import Navegation from './Navegation';
import Button from '../ui/Button';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { FirebaseContext } from '../../firebase';

const ContainerHeader = styled.div`
  max-width: 120rem;
  width: 95%;
  margin: 0 auto;

  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;

const Logo = styled.p`
  color: var(--orange);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: 'Roboto Slab', serif;
  margin-right: 2rem;
`;

const Header = () => {
  const { user, firebase } = useContext(FirebaseContext);

  return (
    <header
      css={css`
        border-bottom: 2px solid var(--gray3);
        padding: 1rem 0;
      `}>
      <ContainerHeader>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}>
          <Link href="/">
            <Logo>P</Logo>
          </Link>
          <Search />
          <Navegation />
        </div>

        <div
          css={css`
            display: flex;
            align-items: center;
          `}>
          {user ? (
            <>
              <p
                css={css`
                  margin-right: 2rem;
                `}>
                Hola: {user.displayName}
              </p>
              <Button bgColor="true" onClick={() => firebase.logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button href="/login" bgColor="true">
                Login
              </Button>
              <Button href="/create-account">Create Account</Button>
            </>
          )}
        </div>
      </ContainerHeader>
    </header>
  );
};

export default Header;
