import pika
import json

# Kết nối đến RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

# Tạo Queue nếu chưa tồn tại
channel.queue_declare(queue='task_queue', durable=True)

# Hàm đẩy dữ liệu vào Queue
def send_to_queue(category_data):
    message = json.dumps(category_data)
    channel.basic_publish(
        exchange='',
        routing_key='task_queue',
        body=message,
        properties=pika.BasicProperties(
            delivery_mode=2,  # Đảm bảo tin nhắn không bị mất
        )
    )
    print(f"Đã đẩy công việc vào Queue: {category_data['category_name']}")

# Ví dụ đẩy dữ liệu vào Queue
category_data = {"category_name": "Electronics", "category_description": "Various electronic items"}
send_to_queue(category_data)

# Đóng kết nối
connection.close()
