import Cart from "../../../DB/models/cart-model.js";
import Product from "../../../DB/models/product-model.js";

//============================== get cart ==============================//
export const getCart = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    res.status(200).json({ cart });
  } catch (error) {
    next(error);
  }
};

//============================== add to cart ==============================//
export const addToCart = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Out of Stock" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex > -1) {
      const newQuantity = cart.products[productIndex].quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({ message: "Out of Stock" });
      }

      cart.products[productIndex].quantity = newQuantity;
      cart.products[productIndex].finalPrice =
        cart.products[productIndex].basePrice * newQuantity;
    } else {
      cart.products.push({
        productId,
        quantity,
        basePrice: product.price,
        finalPrice: product.price * quantity,
        title: product.name,
      });
    }

    cart.subTotal = cart.products.reduce(
      (sum, item) => sum + item.finalPrice,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    next(error);
  }
};

//============================== remove from cart ==============================//
export const removeFromCart = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { productId } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      {
        $pull: { products: { productId } },
      },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.subTotal = cart.products.reduce(
      (sum, item) => sum + item.finalPrice,
      0
    );
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    next(error);
  }
};
