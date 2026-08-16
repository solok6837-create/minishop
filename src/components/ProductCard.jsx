import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { add } = useCart();

  return (
    <div className="card">
      <Link to={`/product/${product.id}`} className="card-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="card-badge">{product.category}</span>
      </Link>
      <div className="card-body">
        <Link to={`/product/${product.id}`} className="card-title">{product.name}</Link>
        <p className="card-desc">{product.description}</p>
        <div className="card-foot">
          <span className="card-price">${product.price.toFixed(2)}</span>
          <button className="btn btn-sm" onClick={() => add(product)}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
