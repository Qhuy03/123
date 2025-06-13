import pika
import json
import threading
from mongoengine import connect, Document, StringField, BooleanField
from mongoengine import Document, StringField, FloatField, IntField, ListField, BooleanField, MapField, DateTimeField, connect, ReferenceField, DictField
connect('productdb', host='localhost', port=27018)
from uuid import uuid4
from slugify import slugify
from datetime import datetime
from bson import ObjectId

class Categories(Document):
    category_name = StringField(required=True, unique=True, index=True)
    category_description = StringField()
    category_slug = StringField()
    category_thumb = StringField()
    parent_category = ReferenceField('Categories', default=None)
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


class Spus(Document):
    product_id = StringField(default=str(uuid4()), required=True, unique=True)
    product_name = StringField(required=True)
    product_thumb = ListField(required=True)
    product_description = StringField()
    product_slug = StringField()
    product_price = FloatField(required=True)
    product_category = ListField(ReferenceField(Categories))
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
    __v = IntField(default=1)  # Hoặc bạn có thể dùng StringField nếu cần

    def save(self, *args, **kwargs):
        # Tạo slug tự động
        if not self.product_slug:
            self.product_slug = slugify(self.product_name)
        super(Spus, self).save(*args, **kwargs)

    meta = {
        "strict": False,
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
    __v = IntField(default=1)  # Hoặc bạn có thể dùng StringField nếu cần

    meta = {
        "strict": False,
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


# Kết nối đến RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.basic_qos(prefetch_count=4)
# Đảm bảo rằng queue 'task_queue' tồn tại
channel.queue_declare(queue='task_queue', durable=True)

def create_product(data):
    # print(data.get("product_category"))
    # return
    category_object_ids = [ObjectId(cat_id) for cat_id in data.get("product_category")]

    try:
        spu = Spus(
            product_name=data.get("product_name"),
            product_thumb=data.get("product_thumb", []),
            product_description=data.get("product_description"),
            product_price=data.get("product_price"),
            product_category=category_object_ids,
            product_shop=data.get("product_shop"),
            product_attributes=data.get("product_attributes"),
            product_quantity=data.get("product_quantity"),
            product_variations=data.get("product_variations"),
            product_id=str(uuid4()),
        )
        spu.save()
        return

        # Create SKUs if provided
        if data["sku_list"]:
            skus = [
                Skus(
                    sku_id=str(uuid4()),
                    sku_tier_idx=sku.get("sku_tier_idx", [0]),
                    sku_price=sku.get("sku_price"),
                    sku_stock=sku.get("sku_stock", 0),
                    product_id=spu.product_id
                )
                for sku in data["sku_list"]
            ]
            Skus.objects.insert(skus)
    except Exception as e:
        print(e)

# Hàm xử lý công việc từ Queue
def callback(ch, method, properties, body):
    data = json.loads(body)
    # print(data["data"])
    # return
    create_product(data["data"])

    ch.basic_ack(delivery_tag=method.delivery_tag)  # Xác nhận việc xử lý thành công

# Hàm để chạy consumer trong thread
def start_consumer():
    # Đăng ký hàm callback để xử lý các thông điệp từ Queue
    channel.basic_consume(queue='task_queue', on_message_callback=callback)

    # Bắt đầu nhận và xử lý các công việc trong queue
    print('Đang chờ công việc...')
    channel.start_consuming()

start_consumer()