import { FC, useEffect, useState } from 'react';
import useSwr from 'swr';
import { useLocation } from 'react-router-dom';
import { fetcher, BASE_URL } from '../../api/productsApi';
import { PathContainer } from '../../components/PathContainer';
import { BackToHomeButton } from '../../components/BackToHomeButton/BackToHomeButton';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import './productDetails.scss';
import classNames from 'classnames';
import { AddProductButtons } from '../../components/AddProductButtons';
import { addProducts } from '../../helpers/addProducts';
import { Product } from '../../types/product';
import { capitalizeLetter } from '../../helpers/capitalizeLetter';
import { ProductsSlider } from '../../components/ProductsSlider';
import { generateRandomProducts } from '../../helpers/generateRandomProducts';
import { Products } from '../../components/Products';

export const ProductDetailsPage: FC = () => {
  const { pathname } = useLocation();
  const { data: product }: { data: Product } = useSwr(
    `${BASE_URL}/${pathname.substring(pathname.lastIndexOf('/') + 1)}.json`,
    fetcher,
    {
      onError: (error) => {
        if (error) {
          return <div>An error occurred</div>;
        }

        return null;
      },
      suspense: true,
    },
  );
  const { data: products }: { data: Product[] } = useSwr(
    `${BASE_URL}.json`,
    fetcher,
    { suspense: true },
  );

  const theme = useAppSelector(state => state.theme.value);
  const {
    name,
    images,
    colorsAvailable,
    capacityAvailable,
    priceRegular,
    priceDiscount,
    description,
  } = product;

  const [currentImage, setCurrentImage] = useState('');
  // const [currentColor, setCurrentColor] = useState('');
  // const [currentCapacity, setCurrentCapacity] = useState('');
  const [generatedProducts, setGeneratedProducts] = useState<Product[]>([]);

  const favoriteProducts
  = useAppSelector(state => state.favoriteProducts.value);
  const shoppingCart = useAppSelector(state => state.shoppingCart.value);
  const dispatch = useAppDispatch();

  const handleAddProductToCart = (product: Product) => {
    addProducts(dispatch, shoppingCart, product, 'shoppingCart');
  };

  const handleAddProductToFavorites = (product: Product) => {
    addProducts(
      dispatch,
      favoriteProducts,
      product,
      'favoriteProducts',
    );
  };

  useEffect(() => {
    setGeneratedProducts(generateRandomProducts(products));
  }, [products]);

  useEffect(() => {
    // setCurrentColor(pathname.split('-')[pathname.split('-').length - 1]);
    // setCurrentCapacity(pathname.split('-')[pathname.split('-').length - 2]);
    setCurrentImage(images[0]);
  }, [pathname]);

  return (
    <div className="product-details">
      <PathContainer pathArray={['Phones', name]} />

      <BackToHomeButton />

      <h1 className={`product-details__title title title--${theme}`}>{name}</h1>

      <div className="product-details__preview-container">
        <div className="product-details__images-container">
          <ul className="product-details__images-list">
            {images.map((image: string) => (
              <button
                className={classNames(`product-details__image-wrapper product-details__image-wrapper--${theme}`,
                  { 'product-details__image-wrapper--active': currentImage === image },
                  { [`product-details__image-wrapper--active__${theme}`]: currentImage === image })}
                key={image}
                onClick={() => setCurrentImage(image)}
              >
                <img
                  src={`../../../_new/${image}`}
                  alt="Image in the list"
                  className={`product-details__small-image product-details__small-image--${theme}`}
                />
              </button>
            ))}
          </ul>

          <img
            src={`../../../_new/${currentImage}`}
            className={`product-details__preview-image product-details__preview-image--${theme}`}
            alt="Preview"
          />
        </div>
        <div className="product-details__control-panel">
          <div className="product-details__options">
            <div className={`product-details__options-container product-details__options-container--${theme}`}>
              <p className="product-details__control-panel-title">Available colors</p>
              <ul className="product-details__available-colors">
                {colorsAvailable.map((color: string) => (
                  color
                  // <Link
                  //   to={pathname.replace(currentColor, color)}
                  //   className={classNames(`product-details__color-circle-container product-details__color-circle-container--${theme}`,
                  //     { 'product-details__color-circle-container--active': currentColor === color },
                  //     { [`product-details__color-circle-container--active__${theme}`]: currentColor === color })}
                  //   key={color}
                  // >
                  //   <div className={`product-details__color-circle product-details__color-circle--${color}`} />
                  // </Link>
                ))}
              </ul>
            </div>
            <div className={`product-details__options-container product-details__options-container--${theme}`}>
              <p className="product-details__control-panel-title">Select capacity</p>
              <ul className="product-details__capacity-options">
                {capacityAvailable.map((capacity: string) => (
                  capacity
                  // <Link
                  //   to={pathname.replace(currentCapacity, capacity.toLowerCase())}
                  //   className={classNames('product-details__capacity-value', `product-details__capacity-value--${theme}`,
                  //     { 'product-details__capacity-value--active': currentCapacity === capacity.toLowerCase() },
                  //     { [`product-details__capacity-value--active__${theme}`]: currentCapacity === capacity.toLowerCase() })}
                  //   key={capacity}
                  // >
                  //   {capacity}
                  // </Link>
                ))}
              </ul>
            </div>
          </div>
          <div className="product-details__add-to-cart-container">
            <div className="product-details__prices">
              <h1 className={`product-details__discount-price product-details__discount-price--${theme}`}>{`$${priceDiscount}`}</h1>
              <h2 className="product-details__full-price">{`$${priceRegular}`}</h2>
            </div>

            <AddProductButtons
              addToCart={handleAddProductToCart}
              addToFavorites={handleAddProductToFavorites}
              product={product}
              longVersion
            />
          </div>
          <div className="product-details__characteristics">
            {Object.entries(product).slice(11, 15).map(entry => (
              <div className="product-details__characteristic" key={String(entry[0])}>
                <p className="product-details__name-of-characteristic">
                  {String(entry[0] === 'ram'
                    ? String(entry[0]).toUpperCase()
                    : capitalizeLetter(String(entry[0])))}
                </p>
                <p className={`product-details__value-of-characteristic product-details__value-of-characteristic--${theme}`}>
                  {String(entry[1])}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="product-details__id">ID: 802390</p>
      </div>

      <div className="product-details__text-container">
        <div className="product-details__about">
          <h2 className={`product-details__subtitle product-details__subtitle--${theme}`}>About</h2>

          <div className={`product-details__about-container product-details__about-container--${theme}`}>
            {description.map((article: { title: string, text: string[] }) => (
              <article className="product-details__article" key={article.title}>
                <h3 className={`product-details__article-title product-details__article-title--${theme}`}>{article.title}</h3>
                {article.text.map((paragraph: string) => (
                  <p className="product-details__article-text" key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </div>

        <div className="product-details__tach-specs">
          <h2 className={`product-details__subtitle product-details__subtitle--${theme}`}>Tech specs</h2>

          <div className={`product-details__characteristics product-details__tech-specs product-details__tech-specs--${theme}`}>
            {Object.entries(product).slice(11).map(entry => (
              <div className="product-details__characteristic" key={String(entry[0])}>
                <p className="product-details__name-of-characteristic product-details__name-of-characteristic--thin">
                  {String(entry[0] === 'ram'
                    ? String(entry[0]).toUpperCase()
                    : capitalizeLetter(String(entry[0])))}
                </p>
                <p className={`product-details__value-of-characteristic product-details__value-of-characteristic--thin product-details__value-of-characteristic--thin__${theme}`}>
                  {String(entry[1])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!!generatedProducts.length && (
        <ProductsSlider
          title="You may also like"
          itemsLength={generatedProducts.length}
        >
          <Products products={generatedProducts} />
        </ProductsSlider>
      )}
    </div>
  );
};
