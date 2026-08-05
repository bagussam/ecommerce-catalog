import { useLoaderData, useSearchParams } from 'react-router-dom';

export default function App() {
  // 1. Fetch data from React Router loader (simulating data fetch)
  const { categories, subCategories, brands, products } = useLoaderData();
  
  // 2. Persistent State Management using URL Search Params
  const [searchParams, setSearchParams] = useSearchParams();

  // Read values from current URL parameters
  const categoryId = searchParams.get('category') || '';
  const subcategoryId = searchParams.get('subcategory') || '';
  const brandId = searchParams.get('brand') || '';

  // 3. Data Filtering Logic (Cascading)
  const filteredSubCategories = subCategories.filter(sc => sc.categoryId === categoryId);
  const filteredBrands = brands.filter(b => b.subCategoryId === subcategoryId);

  let filteredProducts = products;
  if (brandId) {
    filteredProducts = products.filter(p => p.brandId === brandId);
  } else if (subcategoryId) {
    const validBrandIds = brands.filter(b => b.subCategoryId === subcategoryId).map(b => b.id);
    filteredProducts = products.filter(p => validBrandIds.includes(p.brandId));
  } else if (categoryId) {
    const validSubCatIds = subCategories.filter(sc => sc.categoryId === categoryId).map(sc => sc.id);
    const validBrandIds = brands.filter(b => validSubCatIds.includes(b.subCategoryId)).map(b => b.id);
    filteredProducts = products.filter(p => validBrandIds.includes(p.brandId));
  }

  // Helper for Breadcrumbs
  const categoryName = categories.find(c => c.id === categoryId)?.name || '';
  const subCategoryName = subCategories.find(sc => sc.id === subcategoryId)?.name || '';
  const brandName = brands.find(b => b.id === brandId)?.name || '';

  // 4. Handler Functions
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    if (newCategory) {
      setSearchParams({ category: newCategory });
    } else {
      setSearchParams({});
    }
  };

  const handleSubCategoryChange = (e) => {
    const newSubCategory = e.target.value;
    if (newSubCategory) {
      setSearchParams({ category: categoryId, subcategory: newSubCategory });
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    if (newBrand) {
      setSearchParams({ category: categoryId, subcategory: subcategoryId, brand: newBrand });
    } else {
      setSearchParams({ category: categoryId, subcategory: subcategoryId });
    }
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER & RESET BUTTON */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">E-Commerce Catalog</h1>
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-md hover:bg-red-100 transition-colors"
          >
            Reset Filter
          </button>
        </div>

        {/* CASCADING FILTER CONTROLS */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="category" className="text-sm font-semibold text-gray-600">Main Category</label>
            <select 
              id="category"
              name="category" 
              value={categoryId} 
              onChange={handleCategoryChange}
              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- Select Category --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="subcategory" className="text-sm font-semibold text-gray-600">Sub-Category</label>
            <select 
              id="subcategory"
              name="subcategory" 
              value={subcategoryId} 
              onChange={handleSubCategoryChange}
              disabled={!categoryId}
              className="border border-gray-300 rounded-md p-2 disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- Select Sub-Category --</option>
              {filteredSubCategories.map(sc => (
                <option key={sc.id} value={sc.id}>{sc.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="brand" className="text-sm font-semibold text-gray-600">Brand</label>
            <select 
              id="brand"
              name="brand" 
              value={brandId} 
              onChange={handleBrandChange}
              disabled={!subcategoryId}
              className="border border-gray-300 rounded-md p-2 disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- Select Brand --</option>
              {filteredBrands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* DYNAMIC BREADCRUMB */}
        <nav className="product-breadcrumb bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-100 flex gap-2 text-sm text-gray-600" aria-label="breadcrumb">
          <span className="font-medium text-blue-600">All Products</span>
          {categoryName && <><span className="text-gray-400">/</span><span className="font-medium text-blue-600">{categoryName}</span></>}
          {subCategoryName && <><span className="text-gray-400">/</span><span className="font-medium text-blue-600">{subCategoryName}</span></>}
          {brandName && <><span className="text-gray-400">/</span><span className="text-gray-800">{brandName}</span></>}
        </nav>

        {/* MAIN PRODUCT LIST SECTION */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">Products ({filteredProducts.length})</h2>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col justify-between h-32">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-blue-600 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No products match the selected filters.
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
