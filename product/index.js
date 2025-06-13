const express = require("express");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const crypto = require('crypto');
const path = require('path');

function randomUUID() {
    return crypto.randomUUID();
}
// Load environment variables from .env file
dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;
const mongoUri = process.env.MONGO_URI;

const app = express();
app.use(bodyParser.json());

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: apiKey,
});

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

const SpuSchema = new mongoose.Schema(
  {
    product_id: { type: String, default: () => randomUUID(), index: true },
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_slug: { type: String },
    product_price: { type: Number, required: true },
    product_category: { type: [String], default: [] },
    product_quantity: { type: Number, required: true },
    product_shop: { type: String },
    product_attributes: { type: Map, of: String, required: true },
    product_ratingsAverage: { type: Number, default: 4.5, min: 1, max: 5 },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SpuSchema.pre("save", function (next) {
  if (!this.product_slug) {
    this.product_slug = this.product_name.toLowerCase().replace(/ /g, "-");
  }
  next();
});

const Spu = mongoose.model("Spu", SpuSchema);

const SkuSchema = new mongoose.Schema(
  {
    sku_id: { type: String, required: true },
    sku_tier_idx: { type: [Number], default: [0] },
    sku_default: { type: Boolean, default: false },
    sku_thumb: { type: String, default: "" },
    sku_slug: { type: String, default: "" },
    sku_sort: { type: Number, default: 0 },
    sku_price: { type: Number, required: true },
    sku_stock: { type: Number, default: 0 },
    product_id: { type: String, required: true, index: true },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Sku = mongoose.model("Sku", SkuSchema);

app.post("/fetch-product-data", async (req, res) => {
  try {
    // Get the URL from the request body
    const { product_url } = req.body;

    if (!product_url) {
      return res
        .status(400)
        .json({ error: "Missing product_url in request body" });
    }

    // Define the prompt
    const prompt =
      `Lấy thông tin chi tiết của một sản phẩm từ đường dẫn ${product_url} và trả về dữ liệu theo đúng định dạng JSON sau, không thêm bất kỳ thông tin nào khác:\n\n` +
      `{
            "product_shop": "ID của cửa hàng bán sản phẩm",
            "product_name": "Tên sản phẩm",
            "product_thumb": "URL hình ảnh thumbnail của sản phẩm",
            "product_description": "Mô tả sản phẩm chi tiết",
            "product_price": "Giá của sản phẩm (đơn vị: VND hoặc đơn vị tiền tệ phù hợp)",
            "product_quantity": "Số lượng tồn kho của sản phẩm",
            "product_category": ["Danh mục sản phẩm (ví dụ: thời trang, phụ kiện, v.v.)"],
            "product_attributes": {
                "attribute_name_1": "Giá trị thuộc tính 1",
                "attribute_name_2": "Giá trị thuộc tính 2",
                "...": "..."
            },
            "product_variations": [
                {
                    "name": "Tên biến thể (ví dụ: màu sắc, kích thước)",
                    "options": ["Danh sách các tùy chọn của biến thể"]
                }
            ],
            "sku_list": [
                {
                    "sku_tier_idx": [Chỉ mục của từng tùy chọn biến thể],
                    "sku_price": "Giá tương ứng với tổ hợp biến thể",
                    "sku_stock": "Số lượng tồn kho tương ứng với tổ hợp biến thể"
                }
            ]
        }` +
      `\n\nGhi chú:\n    - product_attributes linh hoạt, chứa các thuộc tính tùy chỉnh theo từng sản phẩm.\n    - sku_list có số lượng phần tử bằng tích số lượng options trong product_variations.\n    - Chỉ trả về JSON theo cấu trúc trên, không thêm bất kỳ thông tin hoặc giải thích nào khác. \n - Chỉ cần trả về dạng JSON theo uy cầu, không cần bạn truy cập iternet để lấy dữ liệu thực tế.\n - Giá sản phẩm (price) là số, không cần định dạng tiền tê.`;

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
        {
          role: "assistant",
          content:
            "Tôi đã hiểu yêu cầu. Vui lòng cung cấp đường dẫn sản phẩm để tôi lấy thông tin chi tiết theo đúng định dạng JSON bạn yêu cầu.",
        },
        { role: "user", content: product_url },
      ],
    });

    // Extract the JSON response from OpenAI's output
    console.log(response);
    let productData = response.choices[0].message.content.trim();
            // Loại bỏ đoạn '''json ''' nếu tồn tại
    console.log(productData);
    if (productData.startsWith("```json")) {
        productData = productData.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    res.json({ product_data: productData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/create", async (req, res) => {
  try {
    const {
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variations,
      sku_list = [],
    } = req.body;

    if (!product_name || !product_price || !product_category || !product_shop) {
      return res.status(400).json({
        error:
          "Missing required fields: product_name, product_price, product_category, or product_shop",
      });
    }

    // Create SPU (Standard Product Unit)
    const spu = new Spu({
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variations,
    });

    await spu.save();

    // Simulate database insertion
    console.log("SPU created:", spu);

    // Create SKUs if provided
    if (sku_list.length > 0) {
      const skus = sku_list.map((sku) => ({
        ...sku,
        product_id: spu.product_id,
        sku_id: `${spu.product_id}_${randomUUID()}`,
      }));

      await Sku.insertMany(skus);
    }

    res.status(201).json({ message: "Product created successfully", spu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/products", async (req, res) => {
    try {
        const spus = await Spu.aggregate([
            {
                $lookup: {
                    from: "skus",
                    localField: "product_id",
                    foreignField: "product_id",
                    as: "sku"
                }
            },
            // {
            //     $project: {
            //         isDraft: 0,
            //         isPublished: 0,
            //         isDeleted: 0,
            //         __v: 0,
            //         createdAt: 0,
            //         updatedAt: 0,
            //         "sku.isDraft": 0,
            //         "sku.isPublished": 0,
            //         "sku.isDeleted": 0,
            //         "sku.__v": 0,
            //         "sku.createdAt": 0,
            //         "sku.updatedAt": 0,
            //     }
            // }
        ]);
        res.json({ spus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/search-products', async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: "Missing 'name' query parameter" });
        }

        const spus = await Spu.aggregate([
            {
                $match: {
                    product_name: {
                        $regex: new RegExp(name, 'i')
                    }
                }
            },
            {
                $lookup: {
                    from: "skus",
                    localField: "product_id",
                    foreignField: "product_id",
                    as: "sku"
                }
            },
            {
                $project: {
                    isDraft: 0,
                    isPublished: 0,
                    isDeleted: 0,
                    __v: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    "sku.isDraft": 0,
                    "sku.isPublished": 0,
                    "sku.isDeleted": 0,
                    "sku.__v": 0,
                    "sku.createdAt": 0,
                    "sku.updatedAt": 0,
                }
            }
        ]).select('-isDraft -isPublished -isDeleted -__v -createdAt -updatedAt');

        res.json({ spus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
