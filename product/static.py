from pathlib import Path
import os
import requests
from concurrent.futures import ThreadPoolExecutor
import time
from config import headers, cookies, loadFromJsonFile, saveToJsonFile
import json

excluded_folders = {'.git', 'data', 'node_modules', 'templates', 'venv', '__pycache__'}
# Đọc thư mục hiện tại
current_dir = Path.cwd()  # Lấy thư mục hiện tại
# Đọc thư mục "data"
data_dir = current_dir / 'data_2'  # Đường dẫn đến thư mục "data"
folders_in_data_dir = []
if data_dir.exists() and data_dir.is_dir():
    folders_in_data_dir = [folder.name for folder in data_dir.iterdir() if folder.is_dir()]

# Kết hợp các thư mục từ thư mục hiện tại và thư mục "data"
all_folders = folders_in_data_dir

int_folders = []
for folder in all_folders:
    try:
        int_folders.append(int(folder))
    except ValueError:
        print(f"Không thể chuyển {folder} thành int.")

filename = f"sub_categories.json"
        
# Chuyển dữ liệu thành chuỗi JSON
data_json = json.dumps(int_folders, ensure_ascii=False, indent=4)

# Mở file và ghi dữ liệu vào
with open(filename, 'w', encoding='utf-8') as json_file:
    json_file.write(data_json)

print(f"Dữ liệu đã được ghi vào file {filename}")


def calculate_percentage(parent, child):
    # Chuyển mảng cha và con thành set để dễ dàng kiểm tra sự tồn tại của các phần tử
    parent_set = set(parent)
    child_set = set(child)
    
    # Tính số lượng phần tử con có trong mảng cha
    common_elements = parent_set.intersection(child_set)
    
    # Tính tỷ lệ phần trăm
    percentage = (len(common_elements) / len(parent_set)) * 100
    
    return percentage


categories = loadFromJsonFile("categories.json")

# Tính toán phần trăm
percentage = calculate_percentage(categories, int_folders)
print(f"Tỷ lệ phần trăm của mảng con so với mảng cha: {percentage:.2f}%")

def getProductsByCategories(category = 1789, page = 1):
    params = (
        ('limit', 40),
        ('include', 'advertisement'),
        ('aggregations', 2),
        ('version', 'home-persionalized'),
        ('trackity_id', '722a98bd-b5e1-dbf8-0470-97a3071c27bc'),
        ('category', category),
        ('page', page),
        ('urlKey', 'dien-thoai-may-tinh-bang')
    )
    categoriesWithPage = {}
    try:
        time.sleep(1)
        response = requests.get('https://tiki.vn/api/personalish/v1/blocks/listings',headers=headers, params=params, cookies=cookies)
        data = response.json()
        print(data)
        lastPage = data.get('paging')["last_page"]
        categoriesWithPage["pages"] = lastPage
        categoriesWithPage["id"] = category
    except ValueError as e:
        # Xử lý lỗi khi dữ liệu JSON không hợp lệ
        print(f"Đã xảy ra lỗi khi xử lý dữ liệu JSON: {e}")
    except Exception as e:
        # Xử lý các lỗi khác
        print(f"Đã xảy ra lỗi không xác định: {e}")
    
    return categoriesWithPage


# import threading

# # Biến global để lưu các kết quả
# categoriesWithPage = []

# # Lock để bảo vệ danh sách categoriesWithPage
# lock = threading.Lock()

# # Hàm xử lý getProductsByCategories và cập nhật categoriesWithPage
# def thread_getProductsByCategories(category):
#     result = getProductsByCategories(category)
    
#     # Sử dụng lock để bảo vệ việc cập nhật danh sách
#     with lock:
#         categoriesWithPage.append(result)

# # Danh sách để lưu các thread
# threads = []

# max_threads = 100

# with ThreadPoolExecutor(max_workers=max_threads) as executor:
#     # Gửi các công việc vào thread pool
#     executor.map(thread_getProductsByCategories, categories)

# In kết quả sau khi tất cả các thread đã hoàn thành
# print(categoriesWithPage)
# saveToJsonFile(data=categoriesWithPage, category="category", page=1)