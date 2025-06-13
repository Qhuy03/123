import requests
from flask import Flask, render_template, request, jsonify
import time
import random


from mongoengine import Document, StringField, FloatField, IntField, ListField, BooleanField, MapField, DateTimeField, connect
from datetime import datetime
import uuid

# connect(host="mongodb+srv://manlly:Manh0710.@cluster0.na4w1.mongodb.net/")

# SPU Schema
class Spus(Document):
    product_id = StringField(default=lambda: str(uuid.uuid4()), unique=True, required=True)
    product_name = StringField(required=True)
    product_thumb = ListField(StringField(required=True))
    product_description = StringField()
    product_slug = StringField()
    product_price = FloatField(required=True)
    product_category = ListField(StringField(), default=[])
    product_quantity = IntField(required=True)
    product_shop = StringField()
    product_attributes = MapField(field=StringField(), required=True)
    product_ratingsAverage = FloatField(default=4.5, min_value=1, max_value=5)
    product_variations = ListField()
    isDraft = BooleanField(default=True)
    isPublished = BooleanField(default=False)
    isDeleted = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    def clean(self):
        if not self.product_slug:
            self.product_slug = self.product_name.lower().replace(" ", "-")

    meta = {
        'collection': 'Spus',
        'indexes': ['product_id', 'isDraft', 'isPublished'],
        'ordering': ['-created_at']
    }

# SKU Schema
class Skus(Document):
    sku_id = StringField(required=True, unique=True)
    sku_tier_idx = ListField(IntField(), default=[0])
    sku_default = BooleanField(default=False)
    sku_thumb = StringField(default="")
    sku_slug = StringField(default="")
    sku_sort = IntField(default=0)
    sku_price = FloatField(required=True)
    sku_stock = IntField(default=0)
    product_id = StringField(required=True)
    isDraft = BooleanField(default=True)
    isPublished = BooleanField(default=False)
    isDeleted = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'Skus',
        'indexes': ['product_id', 'isDraft', 'isPublished'],
        'ordering': ['-created_at']
    }




app = Flask(__name__)
def transform_specifications_to_object(specifications):
    result = {}
    for spec in specifications:
        for attribute in spec["attributes"]:
            result[attribute["name"]] = attribute["value"]
    return result

def transform_configurable_options(configurable_options, price):

    if(configurable_options == None):
        return None, None


    product_variations = []
    
    print(configurable_options)
    for option in configurable_options:
        variation = {
            "name": option["name"],
            "options": [value["label"].strip() for value in option["values"]]
        }
        product_variations.append(variation)
    all_options = [variation["options"] for variation in product_variations]
    def generate_combinations(options, idx=0, current_combination=None):
        if current_combination is None:
            current_combination = []

        # Điều kiện dừng: Khi đã duyệt qua tất cả thuộc tính
        if idx == len(options):
            return [current_combination]

        # Tạo tổ hợp với tùy chọn hiện tại
        combinations = []
        for i, value in enumerate(options[idx]):
            combinations += generate_combinations(options, idx + 1, current_combination + [(idx, i)])
        return combinations
    
    combinations = generate_combinations(all_options)

    # Tạo sku_list từ các tổ hợp
    sku_list = [
        {
            "sku_tier_idx": [c[1] for c in combination],
            "sku_price": price,
            "sku_stock": random.randint(1000, 10000),
        }
        for combination in combinations
    ]
    return product_variations, sku_list


@app.route('/')
def home():
    # Render file HTML từ thư mục templates
    return render_template('index.html')

def getdata(json):
    product = {}
    product["product_shop"] = str(json.get('current_seller').get('store_id'))
    product["product_name"] = json.get('name')
    product["product_thumb"] = json.get('thumbnail_url')
    product["product_description"] = json.get('description')
    product["product_price"] = json.get('original_price')
    product["product_quantity"] = random.randint(1000, 10000)
    product["product_category"] = [json.get('categories').get('name')]
    product["product_attributes"] = transform_specifications_to_object(json.get('specifications'))
    product["product_variations"], product["sku_list"] = transform_configurable_options(json.get('configurable_options'), product["product_price"])
    return product

@app.route('/get', methods=['POST'])
def get():
    # Lấy dữ liệu từ API
    data = request.get_json()
    id_value = data.get('id')
    spid_value = data.get('spid')
    cookies = {
        '_trackity': 'a76ff1d2-f8db-4626-59a1-d7c776a51dfd',
        'TOKENS':'{%22access_token%22:%228jUzhpkr9PNyOBJmTLCt02d1R3YuGfHq%22%2C%22expires_in%22:157680000%2C%22expires_at%22:1895317122434%2C%22guest_token%22:%228jUzhpkr9PNyOBJmTLCt02d1R3YuGfHq%22}',
        '_ga': 'GA1.1.1394004427.1737637126',
        'delivery_zone': 'Vk4wMzQwMjQwMTM=',
        '_gcl_au': '1.1.2018865452.1737637132',
        '_fbp': 'fb.1.1737637159631.910860957906806773',
        '__RC': '4',
        '__R': '1',
        '__iid': '749',
        '__iid': '749',
        '__su': '0',
        '__su': '0',
        'tiki_client_id': '1394004427.1737637126',
        '_hjSessionUser_522327': 'eyJpZCI6ImQ4MWViNTlmLThmOGUtNTg0MC1hNDcwLWQ1YjUxYmJjZDZmOSIsImNyZWF0ZWQiOjE3Mzc2MzcxNjE0MzEsImV4aXN0aW5nIjp0cnVlfQ==',
        '__tb': '0',
        '__IP': '712289952',
        '_hjSession_522327': 'eyJpZCI6IjRhODZmYzY2LTM0MTgtNDdhZC04NmVlLWQ0NWQ0NDA5Mzc4NSIsImMiOjE3Mzc4NzI0MDExNzksInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=',
        '__uif': '__uid%3A1853543151746730570%7C__ui%3A-1%7C__create%3A1695354315',
        'cto_bundle': 'OMdNl18zRkZqRHZxN2FvTWNQMzBDQVY3Sk9uSlVJd1ZjUU9TMllzJTJGOFJMQTdDJTJGZnNjc285a3drTzdQMTE0bSUyRnNoejlPTUNpS2UzWjdScjBRbWdkbSUyQmdzNHFvd1hoNllEdzBwc04zNnMlMkJTTGUlMkZ2RDhDWHYxNG4lMkZ5bkVFSCUyQlluVk1pQkRLWWZQaXFWMyUyRno2MkY3V1NLeVQ4SElSekltSFlHOHVXSEdvUVJvVDMlMkJ2bGxUaDNVMTdEaHg0RkFPcDBoTHA5ajRlaEpOc3A1R0p3Q3pTMjI4Mm5CYkElM0QlM0Q',
        '_ga_S9GLR1RQFJ': 'GS1.1.1737878725.7.1.1737878838.53.0.0',
        'amp_99d374': '0LMNrV1MZyubCk0UXKbKke...1iigq9mp3.1iigqd7ba.cg.dq.qa'
    }

    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'accept': 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        'referer': 'https://tiki.vn/may-loc-khong-khi-o-to-cao-cap-boneco-p50-ion-am-lon-khuech-tan-xong-tinh-dau-dung-cho-xe-hoi-xe-day-em-be-ban-lam-viec-hang-nhap-khau-p7139355.html?itm_campaign=CTP_YPD_TKA_PLA_UNK_ALL_UNK_UNK_UNK_UNK_X.157091_Y.1713226_Z.2797625_CN.May-Loc-Khong-Khi%2C-Khu-Mui-xe--TO-BONECO-Thuy-Si-P50-Ion-am%2F-Khuech-Tan-Huong-Tinh-Dau---Hang-Nhap-Khau&itm_medium=CPC&itm_source=tiki-ads&spid=7139357',
        'x-guest-token': '8jUzhpkr9PNyOBJmTLCt02d1R3YuGfHq',
    }
    params = (
        ('platform', 'web'),
        ('spid', spid_value),
        ('version', '3')
    )
    time.sleep(1)
    # response = requests.get('https://tiki.vn/api/v2/products/{}'.format(id_value),headers=headers, params=params, cookies=cookies)
    response = requests.get('https://tiki.vn/api/v2/products/277465334?platform=web&version=3')
    

    product = getdata(response.json())

    return product
@app.route("/create", methods=["POST"])
def create_product():
    try:
        data = request.get_json()

        # Extract fields from request body
        product_name = data.get("product_name")
        product_thumb = data.get("product_thumb")
        product_description = data.get("product_description")
        product_price = data.get("product_price")
        product_category = data.get("product_category", [])
        product_shop = data.get("product_shop")
        product_attributes = data.get("product_attributes", {})
        product_quantity = data.get("product_quantity")
        product_variations = data.get("product_variations", [])
        sku_list = data.get("sku_list", [])

        # Validate required fields
        if not product_name or not product_price or not product_category or not product_shop:
            return jsonify({"error": "Missing required fields: product_name, product_price, product_category, or product_shop"}), 400

        # Create SPU
        spu = Spus(
            product_name=product_name,
            product_thumb=product_thumb,
            product_description=product_description,
            product_price=product_price,
            product_category=product_category,
            product_shop=product_shop,
            product_attributes=product_attributes,
            product_quantity=product_quantity,
            product_variations=product_variations,
        )
        spu.save()

        # Create SKUs if provided
        if sku_list:
            skus = [
                Skus(
                    sku_id=str(uuid.uuid4()),
                    sku_tier_idx=sku.get("sku_tier_idx", [0]),
                    sku_price=sku.get("sku_price"),
                    sku_stock=sku.get("sku_stock", 0),
                    product_id=spu.product_id
                )
                for sku in sku_list
            ]
            Skus.objects.insert(skus)

        return jsonify({"message": "Product created successfully", "spu": spu.to_json()}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
