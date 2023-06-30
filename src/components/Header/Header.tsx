import classNames from 'classnames';
import {
  FC, useEffect, useMemo, useRef, useState,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setSearchValue } from '../../features/searchBar/searchBarSlice';
import { toggleTheme } from '../../features/theme/themeSlice';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Counter } from '../Counter';
import './header.scss';

const nav = [
  {
    name: 'Home',
    to: '/',
  },
  {
    name: 'Phones',
    to: '/phones',
  },
  {
    name: 'Tablets',
    to: '/tablets',
  },
  {
    name: 'Accessories',
    to: '/accessories',
  },
];

export const Header: FC = () => {
  const { pathname } = useLocation();
  const searchBarValue = useAppSelector(state => state.searchBar.value);
  const favoriteProductsLength
    = useAppSelector(state => state.favoriteProducts.value).length;
  const shoppingCart
    = useAppSelector(state => state.shoppingCart.value);
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.theme.value);
  const [, setLocalStorageTheme] = useLocalStorage('theme', theme);
  const quantityOfProductsInShoppingCart = useMemo(() => {
    return shoppingCart.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.quantity;
    }, 0);
  }, [shoppingCart]);
  const [isSearchBarRequested, setIsSearchBarRequested] = useState(false);
  const inputRef = useRef<null | HTMLInputElement>(null);
  const initialUrlAddress = useRef(pathname);

  useEffect(() => {
    if (initialUrlAddress.current !== pathname || !isSearchBarRequested) {
      dispatch(setSearchValue(''));
      setIsSearchBarRequested(false);
      initialUrlAddress.current = pathname;
    }

    if (inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [pathname, isSearchBarRequested]);

  useEffect(() => {
    setLocalStorageTheme(theme);
  }, [theme]);

  const handleSwitchTheme = () => {
    dispatch(toggleTheme());
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearchBarRequested(!isSearchBarRequested);
  };

  const renderSearchButton = () => {
    if (searchBarValue.length) {
      if (theme === 'light') {
        return (
          <button type="submit">
            <img src="/_new/img/icons/close-button-dark.svg" alt="Search bar" />
          </button>
        );
      }

      return (
        <button type="submit">
          <img src="/_new/img/icons/close-button-light.svg" alt="Search bar" />
        </button>
      );
    }

    if (theme === 'light') {
      return (
        <button type="submit">
          <img src="/_new/img/icons/search-dark.svg" alt="Search bar" />
        </button>
      );
    }

    return (
      <button type="submit">
        <img src="/_new/img/icons/search-light.svg" alt="Search bar" />
      </button>
    );
  };

  return (
    <header className={`header__wrapper header__wrapper--${theme}`}>
      <Link to="/" className="header__logo logo">
        {theme === 'light' ? (
          <img src="/_new/img/icons/LOGO-dark.svg" alt="Logo" />
        ) : (
          <img src="/_new/img/icons/LOGO-light.svg" alt="Logo" />
        )}
      </Link>

      <div className="header__content">
        <ul className="header__nav-list">
          {nav.map(({ name, to }) => (
            <li
              className={
                classNames(
                  'header__nav-item',
                  { [`focused__${theme}`]: pathname === to || (pathname.includes(to) && to !== '/') },
                )
              }
              key={name}
            >
              <Link
                to={to}
                className={
                  classNames(
                    `header__nav-link header__nav-link--${theme}`,
                    { [`header__nav-link--highlighted__${theme}`]: pathname === to || (pathname.includes(to) && to !== '/') },
                  )
                }
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="header__right-bar">
          {pathname !== '/' && pathname !== '/shopping-cart' && (
            <form
              onSubmit={(e) => handleFormSubmit(e)}
              className={classNames(
                `header__form header__form--${theme}`,
                { 'header__form--without-input': !isSearchBarRequested },
              )}
            >
              <input
                type="text"
                ref={inputRef}
                value={searchBarValue}
                onChange={(e) => dispatch(setSearchValue(e.target.value))}
                className={classNames(`
                header__search-bar header__search-bar--${theme}`, { 'header__search-bar--not-visible': !isSearchBarRequested })}
                placeholder={`${isSearchBarRequested ? `Search in ${pathname.slice(1)}` : ''}`}
              />

              {renderSearchButton()}
            </form>
          )}

          <Link
            to="/favorites"
            className={
              classNames(`header__icon header__icon--${theme}`,
                { [`focused__${theme}`]: pathname === '/favorites' })
            }
          >
            {theme === 'light' ? (
              <img
                src="/_new/img/icons/favorites-icon-dark.svg"
                alt="Favorites products"
              />
            ) : (
              <img
                src="/_new/img/icons/favorites-icon-light.svg"
                alt="Favorites products"
              />
            )}

            <Counter count={favoriteProductsLength} theme={theme} />
          </Link>

          <Link
            to="/shopping-cart"
            className={
              classNames(`header__icon header__icon--${theme}`,
                { [`focused__${theme}`]: pathname === '/shopping-cart' })
            }
          >
            {theme === 'light' ? (
              <img
                src="/_new/img/icons/shopping-bag-icon-dark.svg"
                alt="Shopping bag"
              />
            ) : (
              <img
                src="/_new/img/icons/shopping-bag-icon-light.svg"
                alt="Shopping bag"
              />
            )}

            <Counter count={quantityOfProductsInShoppingCart} theme={theme} />
          </Link>

          <button
            type="button"
            className={`header__icon header__icon--${theme}`}
            onClick={handleSwitchTheme}
          >
            {theme === 'light' ? (
              <img
                className="header__image"
                src="/_new/img/icons/moon.svg"
                alt="Change theme"
              />
            ) : (
              <img
                className="header__image"
                src="/_new/img/icons/sun.svg"
                alt="Change theme"
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
