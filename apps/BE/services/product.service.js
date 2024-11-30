const { Product, ProductVariation } = require('../models/product.model');
const discountService = require('./discount.service');

class ProductService {
  /**
   * Create multiple products with variations
   * @param {Array} productsData - Array of product data, each containing product details and variations
   */
  static async createProducts(productsData) {
    const productPromises = productsData.map(async (data) => {
      const { variations, ...productData } = data;

      // Create the main product
      const product = new Product(productData);
      await product.save();

      // Initialize the total stock, rating, and sold count
      let totalStock = 0;
      let totalSold = 0;

      // Create variations if available
      if (variations && variations.length > 0) {
        const variationPromises = variations.map(async (variation) => {
          const productVariation = new ProductVariation({
            product: product._id,
            ...variation,
          });
          const savedVariation = await productVariation.save();

          // Update total stock and sold count based on the variations
          totalStock += savedVariation.stock;
          totalSold += savedVariation.sold || 0;

          return savedVariation;
        });

        const savedVariations = await Promise.all(variationPromises);
        product.variations = savedVariations.map((v) => v._id);
      }

      // Update product with total stock, rating, and sold count
      product.stock = totalStock;
      product.sold = totalSold;
      product.rating = productData.rating || 0;

      // Save the product with variations and updated fields
      await product.save();

      return product;
    });

    // Wait for all product creations to complete
    await Promise.all(productPromises);
    return 'Products created successfully';
  }

  /**
   * Create a single product with variations
   * @param {Object} data - Product data including variations
   */
  static async createProduct(data) {
    const { variations, ...productData } = data;

    // Step 1: Create the main product
    const product = new Product(productData);
    await product.save();

    // Initialize the total stock and sold count
    let totalStock = 0;
    let totalSold = 0;
    const variationIds = [];

    // Step 2: Create product variations if provided
    if (variations && variations.length > 0) {
      const variationPromises = variations.map(async (variation) => {
        const productVariation = new ProductVariation({
          product: product._id,
          ...variation,
        });

        const savedVariation = await productVariation.save();
        variationIds.push(savedVariation._id);

        // Update total stock and sold count
        totalStock += savedVariation.stock;
        totalSold += savedVariation.sold || 0;
      });

      await Promise.all(variationPromises);
    }

    // Step 3: Update product with variations
    product.variations = variationIds;
    product.stock = totalStock;
    product.sold = totalSold;
    product.rating = productData.rating || 0;

    await product.save();
    return product;
  }

  /**
   * Get all products, including discounts
   * @param {Object} filter - Query filter for products
   */
  static async getAllProducts(filter = {}) {
    const products = await Product.find(filter)
      .populate('discount')  // Populate the discount field
      .populate({
        path: 'variations',  // Populate variations
        options: { limit: 1 },  // Limit to the first variation
      });
  
    return products
      .filter(product => product.variations.length > 0 && product.discount)  // Only include products with variations and discount
      .map((product) => {
        const firstVariation = product.variations[0];  // Get the first variation
  
        const { price } = firstVariation;
        const { discountType, value } = product.discount;
  
        // Calculate the discount amount based on type (percentage or fixed)
        let discountAmount = 0;
        if (discountType === 'percentage') {
          discountAmount = (value / 100) * price;  // Apply percentage discount
        } else if (discountType === 'fixed') {
          discountAmount = value;  // Apply fixed amount discount
        }
  
        // Ensure discount doesn't exceed the price
        discountAmount = Math.min(discountAmount, price);
  
        const finalPrice = price - discountAmount;  // Calculate final price after discount
  
        return {
          name: product.name,
          image: firstVariation.image,
          price,
          finalPrice,
          discount: product.discount,
        };
      });
  }
  
  
  

  /**
   * Get a single product by ID, including discount calculation
   * @param {String} id - Product ID
   */
  static async getProductById(id) {
    const product = await Product.findById(id).populate('discount');
    if (!product) throw new Error('Product not found');
    return {
      ...product.toObject(),
      finalPrice: this.calculateFinalPrice(product.price, product.discount),
    };
  }

  /**
   * Calculate the final price of a product after applying the discount
   * @param {Number} originalPrice - Original product price
   * @param {Object} discount - Discount details
   */
  static calculateFinalPrice(originalPrice, discount) {
    if (!discount || !discount.isValid()) return originalPrice;

    switch (discount.discountType) {
      case 'percentage':
        return originalPrice - (originalPrice * discount.value) / 100;
      case 'fixed':
        return Math.max(0, originalPrice - discount.value);
      default:
        return originalPrice;
    }
  }

  

  /**
   * Update product details
   * @param {String} productId - Product ID
   * @param {Object} data - Updated product data
   */
  static async updateProduct(productId, data) {
    const product = await Product.findByIdAndUpdate(productId, data, { new: true });
    return product;
  }

  /**
   * Delete a product and its related variations
   * @param {String} productId - Product ID
   */
  static async deleteProduct(productId) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product does not exist');

    await ProductVariation.deleteMany({ product: productId });
    await product.remove();
    return { message: 'Product and related variations deleted successfully' };
  }

  /**
   * Get all products with their variations
   */
  static async getProducts() {
    return await Product.find()
  }
  
  static async getProductWithVariations(productId) {
    const product = await Product.findById(productId).populate('variations');
    if (!product) throw new Error('Product not found');

    return product;
  }
}

module.exports = ProductService;
