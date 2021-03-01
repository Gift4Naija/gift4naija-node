/**
 * FavoriteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const { query } = req;
    if (query.product === "on") {
      query.product = true;
    } else {
      query.product = false;
    }

    const favoriteItems = await Favorite.find(
      {
        owner: req.me.id,
      },
      { product: query.product }
    );

    return res.json({
      success: true,
      data: favoriteItems,
      total: favoriteItems.length,
    });
  },

  getOne: async (req, res) => {
    const queryID = req.params.id;
    const { query } = req;

    if (query.product === "on") {
      query.product = true;
    } else {
      query.product = false;
    }

    const favoriteItem = await Favorite.findOne().where({
      id: queryID,
      owner: req.me.id,
    });

    if (!favoriteItem) {
      return res.notFound();
    }

    return res.json({
      success: true,
      data: favoriteItem,
    });
  },

  /*
   * productName - req.body.productName
   * product - req.body.product
   * owner - req.me.id
   */
  create: async (req, res) => {
    // grab <productId> and <quantity>
    const { product } = req.body;
    // grab <userId>
    const owner = req.me.id;

    // find product
    const _product = await Product.findOne(product);

    // check if product exist in DB
    if (!_product) {
      return res.badRequest(undefined, "Invalid Item");
    }

    const data = { owner, product };

    // create fav-item
    const newFavItem = await Favorite.create(data)
      .fetch()
      .catch((err) => res.badRequest(err));

    if (!newFavItem) {
      return res.badRequest();
    }

    return res.status(201).json({
      success: true,
      data: newFavItem,
      msg: "Successfully added an item to favorites",
    });
  },

  remove: async (req, res) => {
    const removedFavItem = await Favorite.destroyOne({
      id: req.params.id,
      owner: req.me.id,
    }).catch((err) => res.badRequest(err));

    if (!removedFavItem) {
      return res.badRequest();
    }

    return res.json({
      success: true,
      data: removedFavItem,
      msg: "Successfully removed a item from favorites",
    });
  },
};
