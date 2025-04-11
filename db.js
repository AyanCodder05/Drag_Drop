const mongoose = require("mongoose");

const layoutSchema = new mongoose.Schema({
  layout: { type: Array, required: true },
});

const Layout = mongoose.model("Layout", layoutSchema);

module.exports = Layout;
