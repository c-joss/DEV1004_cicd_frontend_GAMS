import { useEffect, useState } from 'react';
import Input from '../../components/forms/Input';
import Button from '../../components/forms/Button';
import api from '../../services/api';

function AdminItemPage() {
const [items, setItems] = useState([]);
const [loadingItems, setLoadingItems] = useState(true);
const [itemsError, setItemsError] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stockQuantity: '',
    description: '',
  });

  
useEffect(() => {
  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      setItemsError('');

      const response = await api.get('/items');
      setItems(
  Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data.items)
      ? response.data.items
      : []
);
    } catch (error) {
      console.error('Failed to load items:', error);
      setItemsError('Unable to load items.');
    } finally {
      setLoadingItems(false);
    }
  };

  fetchItems();
}, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  
async function handleSubmit(e) {
  e.preventDefault();

  try {
    
await api.post('/items', {
  ...form,
  price: Number(form.price),
  stockQuantity: Number(form.stockQuantity),
});

const response = await api.get('/items');

setItems(
  Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data.items)
      ? response.data.items
      : []
);

alert('Item saved successfully!');

  } catch (error) {
    console.error('Failed to save item:', error);
    alert('Unable to save item. Please try again.');
  }
}


  return (
    <section className="admin-form-page">
      <h1>Manage Items</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <Input
          label="Item Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter item name"
          required
        />

        <Input
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Enter item category"
          required
        />

        <Input
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="50"
          required
        />

        
<Input
  label="Stock Quantity"
  name="stockQuantity"
  type="number"
  min="0"
  value={form.stockQuantity}
  onChange={handleChange}
  placeholder="Enter quantity"
  required
/>


        <Input
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter item description"
          required
        />

        <Button type="submit">Save Item</Button>
      </form>

<h2>Existing Items</h2>

{loadingItems && <p>Loading items...</p>}

{itemsError && <p role="alert">{itemsError}</p>}

{!loadingItems && !itemsError && items.length === 0 && (
  <p>No items found.</p>
)}

{!loadingItems && !itemsError && (
  <div className="admin-user-list">
    {items.map((item) => (
      <article className="admin-user-card" key={item._id}>
        <div>
          <h3>{item.name}</h3>
          <p>Category: {item.category}</p>
          <p>Description: {item.description}</p>
        </div>

        <div>
          <p>Price: ${item.price}</p>
          <p>Stock: {item.stockQuantity}</p>
        </div>
      </article>
    ))}
  </div>
)}

    </section>
  );
}

export default AdminItemPage;
