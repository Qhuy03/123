import requests
import time
import random
from colorama import Fore, Back, Style, init

# Khởi động colorama
from config import cookies, headers, getThumbnails, transform_specifications_to_object, transform_configurable_options, saveToJsonFile,loadFromJsonFile

init(autoreset=True)

def getdata(json):
    product = {}
    # print(getThumbnails(json.get('images')))
    product["product_shop"] = str(json.get('current_seller').get('store_id'))
    product["product_name"] = json.get('name')
    print(Fore.WHITE, product["product_name"])
    product["product_thumb"] = getThumbnails(json.get('images'))
    # product["product_thumb"] = json.get('thumbnail_url')
    product["product_description"] = json.get('description')
    product["product_price"] = json.get('original_price')
    product["product_quantity"] = random.randint(1000, 10000)
    product["product_category"] = [json.get('categories').get('name')]
    product["product_attributes"] = transform_specifications_to_object(json.get('specifications'))
    product["product_variations"], product["sku_list"] = transform_configurable_options(json.get('configurable_options'), product["product_price"])
    return product
def get(id):
    # Lấy dữ liệu từ API
    try:
        params = (
            ('platform', 'web'),
            ('version', '3')
        )
        time.sleep(3)

        response = requests.get('https://tiki.vn/api/v2/products/{}'.format(id),headers=headers, params=params, cookies=cookies)

        product = getdata(response.json())
        return product
    except requests.exceptions.RequestException as e:
        # Xử lý lỗi khi gửi yêu cầu HTTP
        print(Fore.RED, f"Đã xảy ra lỗi khi gửi yêu cầu: {e}")
        return None
    except ValueError as e:
        # Xử lý lỗi khi dữ liệu JSON không hợp lệ
        print(Fore.RED, f"Đã xảy ra lỗi khi xử lý dữ liệu JSON: {e}")
        return None
    except Exception as e:
        # Xử lý các lỗi khác
        print(Fore.RED, f"Đã xảy ra lỗi không xác định: {e}")
        return None

def getProductsByCategories(category = 1795, page = 1, products=None):
    if products is None:
        products = [] 
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
    
    try:
        response = requests.get('https://tiki.vn/api/personalish/v1/blocks/listings',headers=headers, params=params, cookies=cookies)
        data = response.json()
        product = data.get("data")
        
        if product:
            for item in product:
                id = item["id"]
                print(Fore.GREEN, category, page, id)
                fetch = get(id)
                # products.extend(product)
                products.append(fetch)

        saveToJsonFile(products, category, page)

        products = []
        lastPage = data.get('paging')["last_page"]

        if(page < lastPage):
            page += 1
            getProductsByCategories(category, page, products)
    except requests.exceptions.RequestException as e:
        # Xử lý các lỗi khi gửi yêu cầu HTTP
        print(Fore.RED, f"Đã xảy ra lỗi khi gửi yêu cầu: {e}")
    except ValueError as e:
        # Xử lý lỗi khi dữ liệu JSON không hợp lệ
        print(Fore.RED, f"Đã xảy ra lỗi khi xử lý dữ liệu JSON: {e}")
    except Exception as e:
        # Xử lý các lỗi khác
        print(Fore.RED, f"Đã xảy ra lỗi không xác định: {e}")
    
    return products

# print(getProductsByCategories())


def getMainCategories():
    params = ()
    response = requests.get('https://api.tiki.vn/raiden/v2/menu-config?platform=desktop',headers=headers, params=params, cookies=cookies)
    data = response.json()
    items = data.get('menu_block')["items"]
    categories = []
    for item in items:
        categories.append(item["link"])
    return categories

def extract_urls(data):
    urls = []

    for item in data:
        # key = item["url_key"] + '/' + str(item["id"])
        key = item["id"]
        urls.append(key)

        if "children" in item and item["children"]:
            urls.extend(extract_urls(item["children"]))

    return urls

def getSubCategories(categories):
    urls = []
    for category in categories:
        category_id = category.split('/c')[-1]
        response = requests.get('https://tiki.vn/api/v2/categories?include=children&parent_id={}'.format(category_id),headers=headers, params=(), cookies=cookies)
        data = response.json().get('data')
        
        urls.extend(extract_urls(data))
    saveToJsonFile(urls, "categories.json")

categories = loadFromJsonFile("categories.json")
sub_categories = loadFromJsonFile("sub_categories.json")
another_categories = list(set(categories) - set(sub_categories))
print(len(categories), len(sub_categories), len(another_categories)) # 3627 1167 2460

products = []
# for category in categories:
    # product = getProductsByCategories(category, page = 1)
    # products.extend(product)
    # saveToJsonFile(products, "products_{}.json".format(category))
    # products = []
    # print(products)

# getSubCategories(getMainCategories())
import threading

# Hàm xử lý phần tử của mỗi thread
def process_elements(start, end, arr):
    # Xử lý các phần tử từ start đến end
    for i in range(start, end):
        print(f"Thread {threading.current_thread().name} đang xử lý danh mục số {arr[i]}")
        getProductsByCategories(arr[i], page = 1)

def process_in_threads(arr):
    # Số lượng thread
    num_threads = 7
    threads = []
    n = len(arr)

    # Tính số phần tử mỗi thread xử lý (phần tử chia đều)
    elements_per_thread = n // num_threads
    remainder = n % num_threads  # Số phần tử còn lại sau khi chia đều

    start_index = 0

    for i in range(num_threads):
        # Số phần tử mỗi thread sẽ xử lý
        end_index = start_index + elements_per_thread + (1 if i < remainder else 0)
        
        # Tạo thread mới cho mỗi phần
        thread = threading.Thread(target=process_elements, args=(start_index, end_index, arr), name=f"Thread-{i+1}")
        threads.append(thread)
        
        # Khởi động thread
        thread.start()
        
        # Cập nhật start_index cho thread tiếp theo
        start_index = end_index

    # Đợi tất cả các thread hoàn thành
    for thread in threads:
        thread.join()

# Ví dụ mảng (có thể có nhiều phần tử hơn 300)
# arr = list(range(1, 350))  # Mảng có 350 phần tử

# Gọi hàm để xử lý mảng bằng thread
process_in_threads(sub_categories)
# getProductsByCategories(8061) 