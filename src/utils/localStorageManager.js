/**
 * Utilidad para gestionar productos localmente cuando el servidor no está disponible
 */

// Clave para almacenar productos en localStorage
const PRODUCTS_STORAGE_KEY = 'sinfonia_local_products';

/**
 * Obtiene todos los productos almacenados localmente
 * @returns {Array} Array de productos
 */
export const getLocalProducts = () => {
  try {
    const productsJson = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return productsJson ? JSON.parse(productsJson) : [];
  } catch (error) {
    console.error('Error al obtener productos locales:', error);
    return [];
  }
};

/**
 * Guarda productos en el almacenamiento local
 * @param {Array} products Array de productos a guardar
 */
export const saveLocalProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    console.error('Error al guardar productos localmente:', error);
    return false;
  }
};

/**
 * Añade un nuevo producto al almacenamiento local
 * @param {Object} product Producto a añadir
 * @returns {Object} Producto añadido con ID temporal
 */
export const addLocalProduct = (product) => {
  try {
    const products = getLocalProducts();
    
    // Crear ID temporal para el producto
    const newProduct = {
      ...product,
      _id: `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      isLocal: true // Marcar como producto local
    };
    
    // Añadir al inicio del array
    products.unshift(newProduct);
    
    // Guardar en localStorage
    saveLocalProducts(products);
    
    return newProduct;
  } catch (error) {
    console.error('Error al añadir producto local:', error);
    return null;
  }
};

/**
 * Actualiza un producto en el almacenamiento local
 * @param {string} id ID del producto a actualizar
 * @param {Object} updatedProduct Datos actualizados del producto
 * @returns {Object|null} Producto actualizado o null si no se encontró
 */
export const updateLocalProduct = (id, updatedProduct) => {
  try {
    const products = getLocalProducts();
    const index = products.findIndex(p => p._id === id);
    
    if (index === -1) return null;
    
    // Actualizar producto
    products[index] = {
      ...products[index],
      ...updatedProduct,
      updatedAt: new Date().toISOString()
    };
    
    // Guardar en localStorage
    saveLocalProducts(products);
    
    return products[index];
  } catch (error) {
    console.error('Error al actualizar producto local:', error);
    return null;
  }
};

/**
 * Elimina un producto del almacenamiento local
 * @param {string} id ID del producto a eliminar
 * @returns {boolean} true si se eliminó correctamente
 */
export const deleteLocalProduct = (id) => {
  try {
    const products = getLocalProducts();
    const filteredProducts = products.filter(p => p._id !== id);
    
    // Guardar en localStorage
    saveLocalProducts(filteredProducts);
    
    return true;
  } catch (error) {
    console.error('Error al eliminar producto local:', error);
    return false;
  }
};

/**
 * Sincroniza productos locales con el servidor cuando esté disponible
 * @param {Function} apiSaveFunction Función para guardar en la API
 * @returns {Promise<Object>} Resultado de la sincronización
 */
export const syncLocalProducts = async (apiSaveFunction) => {
  try {
    const localProducts = getLocalProducts().filter(p => p.isLocal);
    
    if (localProducts.length === 0) {
      return { success: true, message: 'No hay productos locales para sincronizar', syncedCount: 0 };
    }
    
    let syncedCount = 0;
    const errors = [];
    
    // Intentar sincronizar cada producto
    for (const product of localProducts) {
      try {
        // Eliminar propiedades temporales
        const { _id, isLocal, ...productData } = product;
        
        // Guardar en la API
        await apiSaveFunction(productData);
        
        // Marcar como sincronizado
        syncedCount++;
        
        // Eliminar de productos locales
        deleteLocalProduct(_id);
      } catch (error) {
        errors.push({ product, error: error.message });
      }
    }
    
    return {
      success: syncedCount > 0,
      message: `Sincronizados ${syncedCount} de ${localProducts.length} productos`,
      syncedCount,
      errors
    };
  } catch (error) {
    console.error('Error al sincronizar productos:', error);
    return { success: false, message: 'Error al sincronizar productos', error: error.message };
  }
};
