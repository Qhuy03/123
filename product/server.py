from mongoengine import Document, StringField, FloatField, IntField, ListField, BooleanField, MapField, DateTimeField, connect, ReferenceField, DictField
from datetime import datetime
import uuid
from config import loadFromJsonFile, saveToJsonFileError
from mongoengine.connection import get_db
import os
import pika
import json
from uuid import uuid4
from slugify import slugify
from bson import ObjectId

# Kết nối đến RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
connect('productdb', host='localhost', port=27018)
# # Lấy đối tượng cơ sở dữ liệu
# db = get_db()
# collections = db.list_collection_names()


# Tạo Queue nếu chưa tồn tại
channel.queue_declare(queue='task_queue', durable=True)

def send_to_queue(category_data):
    
    response = {
        "pattern": "task_queue.results",
        "data": category_data
    }
    message = json.dumps(response)
    channel.basic_publish(
        exchange='',
        routing_key='task_queue',
        body=message,
        properties=pika.BasicProperties(
            delivery_mode=2,  # Đảm bảo tin nhắn không bị mất
        )
    )
    print(f"Đã đẩy công việc vào Queue:")


class Categories(Document):
    category_name = StringField(required=True, unique=True, index=True)
    category_description = StringField()
    category_slug = StringField()
    category_thumb = StringField()
    parent_category = ReferenceField('self', default=None)
    isActive = BooleanField(default=True)
    isDeleted = BooleanField(default=False)
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)
    __v = IntField(default=1)  # Hoặc bạn có thể dùng StringField nếu cần


    meta = {
        "strict": False,
        'collection': 'Categories',
        'indexes': [
            'category_name',
            'category_description',
            {'fields': ['category_name', 'category_description'], 'name': 'text_index'}
        ]
    }

    def save(self, *args, **kwargs):
        # Tạo slug tự động trước khi lưu
        if not self.category_slug and self.category_name:
            self.category_slug = slugify(self.category_name.lower())
        super(Categories, self).save(*args, **kwargs)

# SPU Schema
class Spus(Document):
    product_id = StringField(default=str(uuid4()), required=True, unique=True)
    product_name = StringField(required=True)
    product_thumb = StringField(required=True)
    product_description = StringField()
    product_slug = StringField()
    product_price = FloatField(required=True)
    product_category = ListField(ReferenceField(Categories, reverse_delete_rule=2), default=[])
    product_quantity = IntField(required=True)
    product_shop = StringField()
    product_attributes = DictField(required=True)
    product_ratingsAverage = FloatField(default=4.5, min_value=1, max_value=5)
    product_variations = ListField()
    isDraft = BooleanField(default=True)
    isPublished = BooleanField(default=False)
    isDeleted = BooleanField(default=False)
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    # Thêm trường phiên bản (__v) (tùy chọn)
    __v = StringField(default='1.0')
    def save(self, *args, **kwargs):
        # Tạo slug tự động
        if not self.product_slug:
            self.product_slug = slugify(self.product_name)
        super(Spus, self).save(*args, **kwargs)

    meta = {
        'collection': 'Spus',
        'indexes': [
            {'fields': ['product_name', 'product_description'], 'name': 'text_index'}
        ]
    }

class Skus(Document):
    sku_id = StringField(required=True, unique=True)
    sku_tier_idx = ListField(IntField(), default=[0])
    sku_default = BooleanField(default=False)
    sku_thumb = StringField(default='')
    sku_slug = StringField(default='')
    sku_sort = IntField(default=0)
    sku_price = FloatField(required=True)
    sku_stock = IntField(default=0)
    product_id = StringField(required=True, index=True)
    isDraft = BooleanField(default=True, index=True, required=False)
    isPublished = BooleanField(default=False, index=True, required=False)
    isDeleted = BooleanField(default=False)
    createdAt = DateTimeField(default=datetime.utcnow)
    updatedAt = DateTimeField(default=datetime.utcnow)

    # Thêm trường phiên bản (__v) (tùy chọn)
    __v = StringField(default='1.0')
    meta = {
        'collection': 'Skus',
        'indexes': [
            'product_id',  # index cho product_id
        ]
    }

    def save(self, *args, **kwargs):
        # Tạo slug tự động nếu chưa có
        if not self.sku_slug:
            self.sku_slug = self.sku_id  # Hoặc sử dụng slugify nếu cần
        super(Skus, self).save(*args, **kwargs)

# Hàm đệ quy để chuyển tất cả ObjectId thành chuỗi
def convert_objectid(obj):
    if isinstance(obj, dict):
        return {key: convert_objectid(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    return obj

def create_product(data):
    try:

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
            print("NOT FOUND!")
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

    except Exception as e:
        print(e)

def find_all_categories_by_name():
    # Sử dụng filter để tìm tất cả các category có category_name tương ứng
    categories = Categories.objects()
    return categories


# def find_category_by_name(category_name):
#     # Sử dụng filter để tìm các category có tên tương ứng
#     category = Categories.objects(category_name=category_name).first()  # .first() trả về category đầu tiên tìm thấy
#     if category:
#         return category
#     else:
#         return None

def find_category_by_name(category_name):
    # Tìm category đầu tiên theo tên
    category = Categories.objects(category_name=category_name).first()
    if category:
        id_currency = category.id
        # Lưu danh sách các category cùng với các parent_category
        parent_categories = []
        
        # Kiểm tra và lấy tất cả các parent_category cho đến khi không còn nữa
        while category.parent_category:
            parent_category = Categories.objects(id=category.parent_category.id).first()
            if parent_category:
                parent_categories.append(parent_category.id)
                category = parent_category  # Cập nhật category hiện tại thành parent_category
            else:
                break
        parent_categories.append(id_currency)
        # Trả về category và các parent_category đã tìm thấy
        return parent_categories
    else:
        return None


# products = loadFromJsonFile("products_320_1.json")
# for product in products:
#     if product == None:
#         continue
#     category = find_category_by_name(product["product_category"][0])
#     if(category == None):
#         print(f"Product category not found for product " + product["product_name"])
#         continue
#     print(category.id)

base_folder='base_folder'
error_folder='error'
categories = []
success_count = 0
error_count = 0
total = 0
not_product = 0
for category_id in os.listdir(base_folder):
    category_folder = os.path.join(base_folder, category_id)
    print(category_folder)
    # Kiểm tra nếu đây là thư mục (category)
    if os.path.isdir(category_folder):
        # Liệt kê các tệp JSON trong thư mục của category
        files = os.listdir(category_folder)
        json_files = [f for f in files if f.startswith(f'products_{category_id}_') and f.endswith('.json')]
        
        for json_file in json_files:
            error_products = []
            # read the json file
            catePath = os.path.join(category_folder, json_file)
            products = loadFromJsonFile(catePath)
            for product in products:
                total += 1
                if not product:
                    not_product += 1
                    continue
                category = find_category_by_name(product["product_category"][0])
                if(category == None):
                    error_products.append(product)
                    error_count += 1
                    continue
                #  successfully
                product["product_category"] = category
                success_count += 1
                print(category)
                send_to_queue(convert_objectid(product))
            saveToJsonFileError(error_products, category_id, json_file)


print(error_count, success_count, total)
# Đóng kết nối
connection.close()